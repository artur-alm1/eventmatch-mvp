// =======================================
// src/middlewares/validate.middleware.ts
// =======================================
import { Request, Response, NextFunction } from "express";

// UUID v4 simples
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requireUuidParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!value || !UUID_V4.test(value)) {
      return res.status(400).json({ error: `Parâmetro ${paramName} inválido` });
    }
    return next();
  };
}

// --- Correção: aceitar array OU variádico ---
// Por quê: evita quebrar rotas existentes que passam array.
export function requireBodyFields(...fields: string[]): (req: Request, res: Response, next: NextFunction) => void;
export function requireBodyFields(fields: string[]): (req: Request, res: Response, next: NextFunction) => void;
export function requireBodyFields(...args: any[]) {
  const fields: string[] = Array.isArray(args[0]) ? (args[0] as string[]) : (args as string[]);
  return (req: Request, res: Response, next: NextFunction) => {
    for (const f of fields) {
      const v = (req.body ?? {})[f];
      if (v === undefined || v === null || v === "") {
        return res.status(400).json({ error: `Campo obrigatório ausente: ${f}` });
      }
    }
    return next();
  };
}
