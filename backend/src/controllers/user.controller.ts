import { Response } from 'express';
import { getUserById } from '../services/user.service';
import { AuthenticatedRequest } from '../types/request';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  return res.json(user);
};
