import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { userId } = verifyToken(token);
    req.userId = userId; // Agora o TS reconhece isso
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
