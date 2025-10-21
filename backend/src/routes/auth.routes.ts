// src/routes/auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Rotas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
