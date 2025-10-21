// src/config/env.ts
//configuracoes de ambiente
import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3333,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  dbUrl: process.env.DATABASE_URL,
};
