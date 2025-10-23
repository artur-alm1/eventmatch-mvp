import { prisma } from '../config/db';
import { ProtocolStatus } from '.prisma/client';     // runtime (const)


/** ÚNICA fonte de verdade para os status finais permitidos */
export const FINAL_STATUSES = [ProtocolStatus.ACEITO, ProtocolStatus.RECUSADO] as const;
/** Alias de tipo restrito exatamente a ACEITO | RECUSADO */
export type ProtocolFinalStatus = typeof FINAL_STATUSES[number];

export async function applyToEvent(providerId: string, eventId: string) {
  // 1) evento precisa existir
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, producerId: true },
  });
  if (!event) {
    throw Object.assign(new Error('Evento não encontrado'), { status: 404 });
  }

  // 2) produtor não pode se candidatar ao próprio evento
  if (event.producerId === providerId) {
    throw Object.assign(new Error('Você não pode se candidatar ao próprio evento'), { status: 400 });
  }

  // 3) impedir duplicidade (há também @@unique no Prisma)
  const existing = await prisma.protocol.findFirst({
    where: { eventId, userId: providerId },
    select: { id: true },
  });
  if (existing) {
    throw Object.assign(new Error('Você já se candidatou para este evento'), { status: 409 });
  }

  // 4) criar protocolo pendente
  return prisma.protocol.create({
    data: {
      eventId,
      userId: providerId,
      status: ProtocolStatus.PENDENTE,
    },
  });
}

/**
 * GET /protocols/me — (se você quiser expor) lista candidaturas do prestador logado
 * Se não for usar, você pode remover a rota/handler e esta função.
 */
export async function listMyProtocols(providerId: string) {
  return prisma.protocol.findMany({
    where: { userId: providerId },
    orderBy: { createdAt: 'desc' },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          location: true,
          producer: { select: { id: true, name: true } },
        },
      },
    },
  });
}

/**
 * PUT /protocols/:id/status — produtor aceita/recusa
 */
export async function updateProtocolStatus(
  producerId: string,
  protocolId: string,
  status: ProtocolFinalStatus, // <<— agora restrito a ACEITO | RECUSADO
) {
  // 1) protocolo precisa existir
  const protocol = await prisma.protocol.findUnique({
    where: { id: protocolId },
    include: { event: { select: { id: true, producerId: true } } },
  });
  if (!protocol) {
    throw Object.assign(new Error('Protocolo não encontrado'), { status: 404 });
  }

  // 2) ownership: só o produtor dono do evento pode alterar
  if (protocol.event.producerId !== producerId) {
    throw Object.assign(new Error('Você não tem permissão para alterar este protocolo'), { status: 403 });
  }

  // 3) transição: somente de PENDENTE para ACEITO/RECUSADO
  if (protocol.status !== ProtocolStatus.PENDENTE) {
    throw Object.assign(new Error('Só é possível alterar protocolos pendentes'), { status: 400 });
  }

  // 4) update
  return prisma.protocol.update({
    where: { id: protocolId },
    data: { status },
  });
}
