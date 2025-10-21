// src/routes/user.routes.ts

import { Router } from 'express';
import { getMe } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types/request';

const router = Router();

router.get(
  '/me',
  authMiddleware,
  (getMe as (req: AuthenticatedRequest, res: any) => any)
);

export default router;
