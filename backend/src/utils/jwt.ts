// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signJwt(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d", ...options });
}

export function verifyJwt<T = any>(token: string) {
  return jwt.verify(token, env.jwtSecret) as T;
}

// ---- Compat: mantém nomes antigos para quem ainda importa signToken/verifyToken
export const signToken = signJwt;
export const verifyToken = verifyJwt;
