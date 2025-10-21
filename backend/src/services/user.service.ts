import { prisma } from '../config/db';

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      resumeUrl: true,
      createdAt: true,
    },
  });
};
