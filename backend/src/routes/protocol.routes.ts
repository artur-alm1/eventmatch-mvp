import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireProvider, requireProducer } from '../middlewares/role.middleware';
import { requireUuidParam, requireBodyFields } from '../middlewares/validate.middleware';
import { apply, getMine, setStatus } from '../controllers/protocol.controller';

const router = Router();

/**
 * POST /protocols/:eventId/apply
 * Prestador se candidata a um evento
 */
router.post(
  '/:eventId/apply',
  authMiddleware,
  requireProvider,
  requireUuidParam('eventId'),
  apply,
);

/**
 * GET /protocols/me
 * Prestador lista suas candidaturas
 */
router.get(
  '/me',
  authMiddleware,
  requireProvider,
  getMine,
);

/**
 * PUT /protocols/:id/status
 * Produtor aceita/recusa
 */
router.put(
  '/:id/status',
  authMiddleware,
  requireProducer,
  requireUuidParam('id'),
  requireBodyFields('status'),
  setStatus,
);

export default router;
