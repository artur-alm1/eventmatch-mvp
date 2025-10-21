import { Request, Response } from 'express';
import { createEvent, listAllEvents, listMyEvents } from '../services/event.service';
import { AuthenticatedRequest } from '../types/request';

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = await createEvent(req.userId, req.body);
    return res.status(201).json(event);
  } catch (error) {
    console.error('[CreateEvent]', error);
    return res.status(500).json({ error: 'Erro ao criar evento' });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const events = await listAllEvents();
  return res.json(events);
};

export const getMine = async (req: AuthenticatedRequest, res: Response) => {
  const events = await listMyEvents(req.userId);
  return res.json(events);
};
