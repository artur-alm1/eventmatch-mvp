import { prisma } from '../config/db';

export const createEvent = async (producerId: string, data: {
  title: string;
  description: string;
  location: string;
  date: Date;
}) => {
  return prisma.event.create({
    data: {
      ...data,
      producerId,
    },
  });
};

/**
 * GET /events — públicos (sem auth)
 */
export const listAllEvents = async () => {
  return prisma.event.findMany({
    orderBy: { date: 'asc' }, // próximos primeiro
    include: {
      producer: { select: { id: true, name: true } }, // contexto mínimo do dono
      _count: { select: { protocols: true } },        // evita N+1 para contagem
    },
  });
};

/**
 * GET /events/me — do produtor autenticado
 */
export const listMyEvents = async (producerId: string) => {
  return prisma.event.findMany({
    where: { producerId },
    include: {
      protocols: true, // produtor enxerga candidaturas recebidas
    },
    orderBy: { createdAt: 'desc' },
  });
};
