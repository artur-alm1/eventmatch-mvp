//src/middlewares/upload.middleware.ts
import multer from "multer";
import type { Request } from "express";

const maxMb = Number(process.env.MAX_UPLOAD_MB || 5);
const allow = new Set(
  (process.env.ALLOW_MIME || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
);

const storage = multer.memoryStorage();

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // Por quê: evitar spoof de Content-Type
  if (!allow.size || allow.has(file.mimetype)) return cb(null, true);
  return cb(Object.assign(new Error("MIME não permitido"), { status: 415 }));
}

export const uploadSingle = multer({
  storage,
  limits: { fileSize: maxMb * 1024 * 1024 },
  fileFilter,
}).single("file");
