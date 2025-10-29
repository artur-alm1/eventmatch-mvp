// src/services/chat.service.ts
/**
 * Chat service — blindado contra divergência de tipos:
 * - Autorização via Prisma
 * - SELECT/INSERT de ChatMessage via SQL tipado ($queryRaw) com RETURNING
 * - Retornos normalizados: { id, protocolId, senderId, body, createdAt }
 */
import { prisma } from "../config/db";
import { Prisma } from ".prisma/client";

export type Conversation = {
  protocolId: string;
  counterpart: { id: string; role: "PRODUTOR" | "PRESTADOR" };
  lastMessage?: { id: string; body: string; createdAt: Date; senderId: string };
};

export async function assertCanChat(
  userId: string,
  protocolId: string
): Promise<{ producerId: string; providerId: string }> {
  if (!userId) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  const proto = await prisma.protocol.findUnique({
    where: { id: protocolId },
    select: {
      id: true,
      status: true,
      userId: true,                            // prestador
      event: { select: { producerId: true } }, // produtor
    },
  });

  if (!proto) throw Object.assign(new Error("Protocolo inexistente"), { status: 404 });
  if (proto.status !== "ACEITO") throw Object.assign(new Error("Chat indisponível"), { status: 403 });

  const producerId = proto.event.producerId;
  const providerId = proto.userId;
  const isParticipant = userId === producerId || userId === providerId;
  if (!isParticipant) throw Object.assign(new Error("Acesso negado ao chat"), { status: 403 });

  return { producerId, providerId };
}

export async function listConversations(userId: string): Promise<Conversation[]> {
  if (!userId) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  const protos = await prisma.protocol.findMany({
    where: {
      status: "ACEITO",
      OR: [{ userId }, { event: { producerId: userId } }],
    },
    select: {
      id: true,
      userId: true,
      createdAt: true,
      event: { select: { producerId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const protocolIds = protos.map((p) => p.id);
  let lastMap = new Map<string, { id: string; body: string; createdAt: Date; senderId: string }>();

  if (protocolIds.length > 0) {
    const rows = await prisma.$queryRaw<
      Array<{ protocolId: string; id: string; body: string; createdAt: Date; senderId: string }>
    >(Prisma.sql`
      SELECT DISTINCT ON (m."protocolId")
             m."protocolId",
             m."id",
             m."body",
             m."createdAt",
             m:"senderId"
      FROM "ChatMessage" m
      WHERE m."protocolId" IN (${Prisma.join(protocolIds)})
      ORDER BY m."protocolId", m."createdAt" DESC
    `);
    lastMap = new Map(rows.map((r) => [r.protocolId, { id: r.id, body: r.body, createdAt: r.createdAt, senderId: r.senderId }]));
  }

  return protos.map((p) => {
    const producerId = p.event.producerId;
    const providerId = p.userId;
    const isProducer = userId === producerId;
    const counterpartId = isProducer ? providerId : producerId;
    const counterpartRole: "PRESTADOR" | "PRODUTOR" = isProducer ? "PRESTADOR" : "PRODUTOR";
    return {
      protocolId: p.id,
      counterpart: { id: counterpartId, role: counterpartRole },
      lastMessage: lastMap.get(p.id),
    };
  });
}

export async function listMessages(
  userId: string,
  protocolId: string,
  limit = 50,
  before?: string
) {
  await assertCanChat(userId, protocolId);

  const beforeDate = before ? new Date(before) : null;
  const rows = await prisma.$queryRaw<
    Array<{ id: string; senderId: string; body: string; createdAt: Date; readAt: Date | null }>
  >`
    SELECT "id", "senderId", "body", "createdAt", "readAt"
    FROM "ChatMessage"
    WHERE "protocolId" = ${protocolId}
      AND (${beforeDate} IS NULL OR "createdAt" < ${beforeDate})
    ORDER BY "createdAt" DESC
    LIMIT ${Math.min(limit, 100)}
  `;
  return rows;
}

export async function sendMessage(userId: string, protocolId: string, body: string) {
  if (!body || !body.trim()) throw Object.assign(new Error("Mensagem vazia"), { status: 422 });
  if (body.length > 2000) throw Object.assign(new Error("Mensagem muito longa"), { status: 422 });

  await assertCanChat(userId, protocolId);

  // INSERT com RETURNING — shape controlado por nós (sem tipos “fantasma”)
  const rows = await prisma.$queryRaw<
    Array<{ id: string; protocolId: string; senderId: string; body: string; createdAt: Date }>
  >`
    INSERT INTO "ChatMessage" ("protocolId","senderId","body")
    VALUES (${protocolId}, ${userId}, ${body.trim()})
    RETURNING "id","protocolId","senderId","body","createdAt"
  `;
  return rows[0];
}
/** Marca como lida uma mensagem recebida pelo usuário. */
export async function markMessageAsRead(userId: string, messageId: string) {
  if (!userId) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  // Busca protocolo e remetente da mensagem
  const msgRow = await prisma.$queryRaw<
    Array<{ id: string; protocolId: string; senderId: string; readAt: Date | null }>
  >`
    SELECT "id","protocolId","senderId","readAt"
    FROM "ChatMessage"
    WHERE "id" = ${messageId}
    LIMIT 1
  `;
  const found = msgRow[0];
  if (!found) throw Object.assign(new Error("Mensagem inexistente"), { status: 404 });

  // Autorização por participação no protocolo (e status ACEITO)
  await assertCanChat(userId, found.protocolId);

  // Não permite "marcar como lida" a própria mensagem enviada
  if (found.senderId === userId) {
    throw Object.assign(new Error("Operação inválida para mensagens do próprio usuário"), { status: 422 });
  }

  // Idempotente: só atualiza se ainda não tiver readAt
  const rows = await prisma.$queryRaw<
    Array<{ id: string; protocolId: string; readAt: Date }>
  >`
    UPDATE "ChatMessage"
       SET "readAt" = now()
     WHERE "id" = ${messageId}
       AND "readAt" IS NULL
    RETURNING "id","protocolId","readAt"
  `;

  // Se já estava lida, retorna o estado atual
  if (rows.length === 0) {
    const again = await prisma.$queryRaw<Array<{ id: string; protocolId: string; readAt: Date }>>`
      SELECT "id","protocolId","readAt" FROM "ChatMessage" WHERE "id" = ${messageId} LIMIT 1
    `;
    return again[0];
  }
  return rows[0];
}