// ==============================================
// path: src/controllers/review.controller.ts
// ==============================================
import { Response } from "express";
import { AuthenticatedRequest } from "../types/request";
import { prisma } from "../config/db";
import { createReview, listReceivedReviews, summaryForUser, pendingToReview } from "../services/review.service";

export const postReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await createReview(req.userId, req.body);
    return res.status(201).json(data);
  } catch (err: any) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getMyPending = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // authMiddleware injeta userId; buscamos role aqui (padrão do projeto)
    const me = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, role: true } });
    if (!me) return res.status(401).json({ error: "auth required" });
    const items = await pendingToReview(me.id, me.role);
    return res.json({ items });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const summary = await summaryForUser(userId);
    return res.json(summary);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt((req.query.page as string) ?? "1", 10);
    const pageSize = parseInt((req.query.pageSize as string) ?? "10", 10);
    const list = await listReceivedReviews(userId, page, pageSize);
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
