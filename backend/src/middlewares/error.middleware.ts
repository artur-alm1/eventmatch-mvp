// backend/src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/appError";

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  // Por quê: manter respostas consistentes e sem vazar stack.
  if (err instanceof AppError) {
    const payload: Record<string, unknown> = { error: err.message, code: err.code };
    if (err.details) payload.details = err.details;
    return res.status(err.status).json(payload);
  }
  if (typeof err?.status === "number") {
    return res.status(err.status).json({ error: err.message || "Error" });
  }
  // Heurística leve para libs de validação (ex.: Zod/Joi) sem criar acoplamento
  if (err?.name === "ZodError" && Array.isArray(err?.issues)) {
    return res.status(422).json({ error: "ValidationError", details: err.issues });
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  return res.status(500).json({ error: "InternalServerError" });
}

