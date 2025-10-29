import { Request, Response } from "express";
import { saveResumeToDb, getResumeBinary, listMyResumes } from "../services/portfolio.service";
import { searchMyResumes } from "../services/portfolio.service";

export async function uploadResume(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  if (!req.file) return res.status(400).json({ error: 'Arquivo ausente (campo "file")' });
  try {
    const result = await saveResumeToDb(req.userId, req.file);
    return res.status(201).json({
      id: result.meta.id,
      filename: result.meta.filename,
      mimeType: result.meta.mimeType,
      size: result.meta.size,
      createdAt: result.meta.createdAt,
      summary: result.summary,
    });
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[UploadResume]", err); // Por quê: auditoria de falhas
    return res.status(status).json({ error: err?.message || "Falha ao processar currículo" });
  }
}

export async function listMyResumesCtrl(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const items = await listMyResumes(req.userId);
    return res.json(items);
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[ListResumes]", err);
    return res.status(status).json({ error: err?.message || "Falha ao listar arquivos" });
  }
}

export async function downloadResume(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const { id } = req.params as { id: string };
    const file = await getResumeBinary(req.userId, id);
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Length", String(file.size));
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.filename)}"`);
    return res.status(200).send(Buffer.from(file.data as any));
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[DownloadResume]", err);
    return res.status(status).json({ error: err?.message || "Falha ao baixar arquivo" });
  }
}

export async function searchMyResumesCtrl(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthorized" });
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(Number(req.query.limit || 10), 50);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const items = await searchMyResumes(req.userId, q, limit, offset);
    return res.json({ q, limit, offset, count: items.length, items });
  } catch (err: any) {
    const status = err?.status || 500;
    if (status >= 500) console.error("[SearchResumes]", err);
    return res.status(status).json({ error: err?.message || "Falha na busca" });
  }
}

