// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Simples validador de UUID v4 (suficiente para validar params)
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

export function requireBodyFields<T extends string[]>(...fields: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const f of fields) {
      if (req.body[f] === undefined || req.body[f] === null || req.body[f] === '') {
        return res.status(400).json({ error: `Campo obrigatório ausente: ${f}` });
      }
    }
    return next();
  };
}
