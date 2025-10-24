// backend/src/routes/health.routes.ts
import { Router } from "express";
import { prisma } from "../config/db";

const router = Router();

// Por quê: endpoint de liveness/readiness + DB check.
router.get("/health", async (_req, res) => {
  let db: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "up";
  } catch {
    db = "down";
  }
  return res.status(200).json({
    status: "ok",
    db,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;