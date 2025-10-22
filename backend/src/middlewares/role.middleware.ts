// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const requireProducer = async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (user?.role !== 'PRODUTOR') {
    return res.status(403).json({ error: 'Apenas produtores podem acessar essa rota' });
  }

  next();
};
