// src/utils/jwt.ts

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

interface Payload {
  userId: string;
}

// Gera um token assinado com ID do usuário
export function signToken(payload: Payload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token válido por 7 dias
  });
}

// Valida e decodifica um token
export function verifyToken(token: string): Payload {
  return jwt.verify(token, JWT_SECRET) as Payload;
}
