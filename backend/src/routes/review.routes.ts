// ==============================================
// path: src/routes/review.routes.ts
// ==============================================
import { Router } from "express";
import { postReview, getMyPending, getUserSummary, getUserReviews } from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireBodyFields, requireUuidParam } from "../middlewares/validate.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireBodyFields(["toUserId", "eventId", "performance", "recommend"]),
  postReview
);
router.get("/pending", authMiddleware, getMyPending);
router.get("/user/:userId/summary", requireUuidParam("userId"), getUserSummary);
router.get("/user/:userId", requireUuidParam("userId"), getUserReviews);

export default router;
