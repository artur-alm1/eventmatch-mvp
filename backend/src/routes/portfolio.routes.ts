import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import { uploadResume, downloadResume, listMyResumesCtrl } from "../controllers/portfolio.controller";

const router = Router();

router.post("/upload", authMiddleware, uploadSingle, uploadResume);
router.get("/me/files", authMiddleware, listMyResumesCtrl);
router.get("/files/:id", authMiddleware, downloadResume);

export default router;
