import { Router } from 'express';
import { create, getAll, getMine } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, create);       // Criar evento (precisa estar logado como PRODUTOR)
router.get('/', getAll);                        // Listar todos os eventos públicos
router.get('/me', authMiddleware, getMine);     // Listar eventos do usuário autenticado

export default router;
