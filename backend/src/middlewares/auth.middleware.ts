import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env"; 

type JwtUser = { id: string; role: "PRODUTOR" | "PRESTADOR" };

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { userId } = verifyToken(token);
    req.userId = userId;        // <<< obrigatório p/ casar com a augmentation
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtUser;
      req.user = payload;
      req.userId = payload.id;
    } catch { /* silêncio por privacidade */ }
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "auth required" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtUser;
    req.user = payload;
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}