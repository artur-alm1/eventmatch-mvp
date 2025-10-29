// ==============================================
// path: src/routes/chat.routes.ts
// ==============================================
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getConversations, getMessages, postMessage, postMarkRead } from "../controllers/chat.controller";

const router = Router();

router.use(authMiddleware);
router.get("/conversations", getConversations);
router.get("/messages/:protocolId", getMessages);
router.post("/messages", postMessage);
router.post("/messages/read", postMarkRead);

export default router;
