// src/config/db.ts
//conexao prisma com o banco de dados
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
