//Criar funções utilitárias para:
//Assinar (gerar) tokens JWT ao logar ou cadastrar
//Verificar (validar) tokens JWT nas rotas protegidas 
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface Payload {
  userId: string;
}

export function signToken(payload: Payload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: '7d', // expira em 7 dias
  });
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, env.jwtSecret) as Payload;
}
