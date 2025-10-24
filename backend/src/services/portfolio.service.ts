// src/services/portfolio.service.ts
/**
 * Por quê: concentrar upload/extração/leitura no DB (Railway) para MVP 100% OSS.
 */
import { prisma } from "../config/db";
import { fileTypeFromBuffer } from "file-type";
import pdfParse = require("pdf-parse");

export type ResumeSummary = { email?: string; phone?: string; skills?: string[] };
export type CreatedMeta = { id: string; filename: string; mimeType: string; size: number; createdAt: Date };

export async function saveResumeToDb(
  userId: string,
  file: Express.Multer.File
): Promise<{ meta: CreatedMeta; summary: ResumeSummary }> {
  if (!userId) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  if (!file?.buffer) throw Object.assign(new Error("Arquivo inválido"), { status: 400 });

  // 1) Detecta MIME real
  const ft = await fileTypeFromBuffer(file.buffer);
  const mime = ft?.mime || file.mimetype || "";
  const ext = ft?.ext || "";

  // 2) Valida allowlist antes de parsear
  const allow = new Set(
    (process.env.ALLOW_MIME || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  );
  if (!allow.has(mime)) {
    const err: any = new Error("Tipo de arquivo não suportado"); err.status = 415; throw err;
  }

// garantir que NÃO exista "import pdfParse = require('pdf-parse')" no topo

// ...
let text = "";
if (mime === "application/pdf") {
  type PdfParseFn = (data: Buffer) => Promise<{ text: string }>;
  const mod = await import("pdf-parse");
  const pdfParse: PdfParseFn = (mod as any).default ?? (mod as any); // cobre CJS e ESM
  const out = await pdfParse(file.buffer);
  text = out?.text || "";
} else if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
  const { extractRawText } = await import("mammoth");
  const out = await extractRawText({ buffer: file.buffer });
  text = out?.value || "";
} else {
  const err: any = new Error("Formato não suportado"); err.status = 415; throw err;
}



  // 4) Summary heurístico
  const summary = summarize(text);

  // 5) Persistência no Postgres
  const created = await prisma.resumeFile.create({
    data: {
      userId,
      filename: file.originalname || `cv.${ext || "bin"}`,
      mimeType: mime,
      size: file.size,
      data: file.buffer,
      textExtraction: text || null,
    },
    select: { id: true, filename: true, mimeType: true, size: true, createdAt: true },
  });

  return { meta: created, summary };
}

export async function listMyResumes(userId: string) {
  if (!userId) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return prisma.resumeFile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, mimeType: true, size: true, createdAt: true },
  });
}

export async function getResumeBinary(userId: string, id: string) {
  if (!userId) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  const file = await prisma.resumeFile.findFirst({
    where: { id, userId },
    select: { filename: true, mimeType: true, data: true, size: true },
  });
  if (!file) {
    const err: any = new Error("Arquivo não encontrado"); err.status = 404; throw err;
  }
  return file;
}

function summarize(text: string): ResumeSummary {
  const email = (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0];
  const phone = (text.match(/(\+?\d{2}\s*)?(\(?\d{2}\)?\s*)?\d{4,5}[-.\s]?\d{4}/) || [])[0];
  const SKILLS = ["iluminação","som","palco","eletricista","roadie","produção","cenografia"];
  const skills = SKILLS.filter(s => new RegExp(`\\b${s}\\b`, "i").test(text));
  return { email, phone, skills };
}
