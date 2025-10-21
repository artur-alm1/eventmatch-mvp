import { prisma } from '../config/db';

export const createEvent = async (producerId: string, data: {
  title: string;
  description: string;
  location: string;
  date: Date;
}) => {
  return await prisma.event.create({
    data: {
      ...data,
      producerId,
    },
  });
};

export const listAllEvents = async () => {
  return await prisma.event.findMany({
    include: {
      producer: {
        select: { id: true, name: true },
      },
    },
  });
};

export const listMyEvents = async (producerId: string) => {
  return await prisma.event.findMany({
    where: { producerId },
    include: {
      protocols: true,
    },
  });
};
