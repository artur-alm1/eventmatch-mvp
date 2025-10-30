// backend/src/config/env.ts
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

function findEnv(): string | undefined {
  // 1) variável explícita; 2) raiz do backend; 3) dentro de src; 4) CWD
  const candidates = [
    process.env.ENV_FILE,
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../.env")
  ].filter(Boolean) as string[];

  for (const p of candidates) { try { if (fs.existsSync(p)) return p; } catch {} }
  return undefined;
}

const envPath = findEnv();
dotenv.config(envPath ? { path: envPath } : undefined);

// Falhar cedo (evita app subir sem segredo/db)
const required = ["DATABASE_URL", "JWT_SECRET"] as const;
const missing = required.filter(k => !process.env[k] || String(process.env[k]).trim() === "");
if (missing.length) throw new Error(`Missing required env var(s): ${missing.join(", ")}`);

export const env = {
  PORT: Number(process.env.PORT || 3000),
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,

  // Aliases legados (caso seu código antigo use camelCase)
  get port() { return this.PORT; },
  get databaseUrl() { return this.DATABASE_URL; },
  get jwtSecret() { return this.JWT_SECRET; },
};

