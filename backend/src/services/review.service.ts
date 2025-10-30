// ==============================================
// path: src/services/review.service.ts
// ==============================================
import { prisma } from "../config/db";
import { ProtocolStatus, Role } from "@prisma/client";

type ReviewCreateInput = {
  toUserId: string;
  eventId: string;
  protocolId?: string;
  performance: number; // 1..5
  recommend: number;   // 0..10
  comment?: string;
};

export async function createReview(fromUserId: string, input: ReviewCreateInput) {
  const { toUserId, eventId, protocolId, performance, recommend, comment } = input;

  if (fromUserId === toUserId) {
    const e = new Error("Usuário não pode se autoavaliar"); (e as any).status = 400; throw e;
  }
  if (!Number.isInteger(performance) || performance < 1 || performance > 5) {
    const e = new Error("performance deve estar entre 1 e 5"); (e as any).status = 422; throw e;
  }
  if (!Number.isInteger(recommend) || recommend < 0 || recommend > 10) {
    const e = new Error("recommend deve estar entre 0 e 10"); (e as any).status = 422; throw e;
  }

  // Deve existir PROTOCOLO FINALIZADO entre as partes neste evento
  const protocol = await prisma.protocol.findFirst({
    where: {
      id: protocolId ?? undefined,
      eventId,
      status: ProtocolStatus.FINALIZADO,
      OR: [
        { userId: fromUserId, event: { producerId: toUserId } },       // prestador -> produtor
        { userId: toUserId,   event: { producerId: fromUserId } },     // produtor -> prestador
      ],
    },
    select: { id: true },
  });
  if (!protocol) {
    const e = new Error("Avaliação só é permitida após protocolo FINALIZADO entre as partes"); (e as any).status = 403; throw e;
  }

  // Evita duplicidade por direção/evento
  const dup = await prisma.review.findUnique({
    where: { unique_review_per_event_direction: { fromUserId, toUserId, eventId } },
  });
  if (dup) { const e = new Error("Avaliação já enviada para este evento/usuário"); (e as any).status = 409; throw e; }

  return prisma.review.create({
    data: { fromUserId, toUserId, eventId, protocolId: protocol.id, performance, recommend, comment },
  });
}

export async function listReceivedReviews(userId: string, page = 1, pageSize = 10) {
  const p = Math.max(1, page);
  const size = Math.min(50, Math.max(1, pageSize));
  const skip = (p - 1) * size;

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: { select: { id: true, name: true, avatarUrl: true } },
        event: { select: { id: true, title: true, date: true } },
      },
      orderBy: { createdAt: "desc" },
      skip, take: size,
    }),
    prisma.review.count({ where: { toUserId: userId } }),
  ]);

  return { items, total, page: p, pageSize: size };
}

export async function summaryForUser(userId: string) {
  const [agg, dist, bucketsRaw] = await Promise.all([
    prisma.review.aggregate({
      where: { toUserId: userId },
      _avg: { performance: true, recommend: true },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ["performance"],
      where: { toUserId: userId },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ["recommend"],
      where: { toUserId: userId },
      _count: { _all: true },
    }),
  ]);

  const buckets = { detractors: 0, passives: 0, promoters: 0 };
  for (const b of bucketsRaw) {
    if (b.recommend <= 6) buckets.detractors += b._count._all;
    else if (b.recommend <= 8) buckets.passives += b._count._all;
    else buckets.promoters += b._count._all;
  }

  return {
    count: agg._count._all,
    avgPerformance: Number(agg._avg.performance?.toFixed(2) ?? 0),
    avgRecommend: Number(agg._avg.recommend?.toFixed(2) ?? 0),
    distribution: dist.map(d => ({ stars: d.performance, count: d._count._all })).sort((a,b)=>a.stars-b.stars),
    buckets,
  };
}

/** Pendências: quem eu ainda devo avaliar (por protocolo FINALIZADO sem review enviada). */
export async function pendingToReview(meId: string, role: Role) {
  if (role === Role.PRODUTOR) {
    const protocols = await prisma.protocol.findMany({
      where: { status: ProtocolStatus.FINALIZADO, event: { producerId: meId } },
      include: { user: { select: { id: true, name: true, avatarUrl: true } }, event: { select: { id: true, title: true, date: true } } },
    });
    const rows = await Promise.all(protocols.map(async p => {
      const exists = await prisma.review.findUnique({
        where: { unique_review_per_event_direction: { fromUserId: meId, toUserId: p.userId, eventId: p.eventId } },
      });
      return exists ? null : { event: p.event, toUser: p.user, protocolId: p.id };
    }));
    return rows.filter(Boolean);
  } else {
    const protocols = await prisma.protocol.findMany({
      where: { status: ProtocolStatus.FINALIZADO, userId: meId },
      include: { event: { select: { id: true, title: true, date: true, producerId: true } } },
    });
    const rows = await Promise.all(protocols.map(async p => {
      const toUserId = p.event.producerId;
      const exists = await prisma.review.findUnique({
        where: { unique_review_per_event_direction: { fromUserId: meId, toUserId, eventId: p.eventId } },
      });
      return exists ? null : { event: p.event, toUserId, protocolId: p.id };
    }));
    return rows.filter(Boolean);
  }
}
