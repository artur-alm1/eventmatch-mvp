import { Response } from 'express';
import { AuthenticatedRequest } from '../types/request';
import {
  applyToEvent,
  listMyProtocols,         // remova se não usar GET /protocols/me
  updateProtocolStatus,
  FINAL_STATUSES,          // reutilizamos a mesma lista para validar
  type ProtocolFinalStatus // e o mesmo tipo
} from '../services/protocol.service';

export async function apply(req: AuthenticatedRequest, res: Response) {
  try {
    const { eventId } = req.params;
    const protocol = await applyToEvent(req.userId, eventId);
    return res.status(201).json(protocol);
  } catch (err: any) {
    const status = err?.status ?? 500;
    if (status >= 500) console.error('[ProtocolApply]', err);
    return res.status(status).json({ error: err?.message ?? 'Erro interno ao criar candidatura' });
  }
}

export async function getMine(req: AuthenticatedRequest, res: Response) {
  try {
    const items = await listMyProtocols(req.userId);
    return res.json(items);
  } catch (err: any) {
    console.error('[ProtocolGetMine]', err);
    return res.status(500).json({ error: 'Erro ao listar candidaturas' });
  }
}

export async function setStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: ProtocolFinalStatus | string };

    // validação de runtime usando a MESMA fonte do tipo:
    if (!FINAL_STATUSES.includes(status as ProtocolFinalStatus)) {
      return res.status(400).json({ error: "Status inválido. Use 'ACEITO' ou 'RECUSADO'." });
    }

    const updated = await updateProtocolStatus(req.userId, id, status as ProtocolFinalStatus);
    return res.json(updated);
  } catch (err: any) {
    const statusCode = err?.status ?? 500;
    if (statusCode >= 500) console.error('[ProtocolSetStatus]', err);
    return res.status(statusCode).json({ error: err?.message ?? 'Erro ao atualizar status' });
  }
}
