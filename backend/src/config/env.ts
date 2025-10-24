// backend/src/config/env.ts
import * as dotenv from "dotenv";
dotenv.config();

// Por quê: falhar cedo evita deploy "verde" com app quebrado.
const required = ["DATABASE_URL", "JWT_SECRET"] as const;
const missing = required.filter(k => !process.env[k] || String(process.env[k]).trim() === "");
if (missing.length) {
  throw new Error(`Missing required env var(s): ${missing.join(", ")}`);
}

export const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
};
