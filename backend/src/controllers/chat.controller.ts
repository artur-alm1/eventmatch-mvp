// ==============================================
// path: src/controllers/chat.controller.ts
// ==============================================
import { Request, Response } from "express";
import {
  listConversations,
  listMessages,
  sendMessage,
  markMessageAsRead,
} from "../services/chat.service";

export async function getConversations(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const items = await listConversations(req.userId);
    return res.json({ count: items.length, items });
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[Chat:getConversations]", err);
    return res.status(status).json({ error: err?.message || "Falha ao listar conversas" });
  }
}

export async function getMessages(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const { protocolId } = req.params as { protocolId: string };
    const limit = Math.min(Number(req.query.limit || 50), 100);
    const before = req.query.before ? String(req.query.before) : undefined;
    const items = await listMessages(req.userId, protocolId, limit, before);
    return res.json({ protocolId, count: items.length, items });
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[Chat:getMessages]", err);
    return res.status(status).json({ error: err?.message || "Falha ao listar mensagens" });
  }
}

export async function postMessage(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const { protocolId, body } = req.body as { protocolId: string; body: string };
    const msg = await sendMessage(req.userId, protocolId, body);
    return res.status(201).json(msg);
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[Chat:postMessage]", err);
    return res.status(status).json({ error: err?.message || "Falha ao enviar mensagem" });
  }
}

export async function postMarkRead(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const { messageId } = req.body as { messageId: string };
    const out = await markMessageAsRead(req.userId, messageId);
    return res.status(200).json(out);
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[Chat:postMarkRead]", err);
    return res.status(status).json({ error: err?.message || "Falha ao marcar como lida" });
  }
}
