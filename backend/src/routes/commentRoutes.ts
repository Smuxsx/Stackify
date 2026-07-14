import { requireAuth } from "@clerk/express";
import { Router } from "express";
import * as commentController from "../controllers/commentController.ts"

const router = Router();

// POST /api/comments/:productId create a comment
router.post("/:productId", requireAuth(), commentController.createComment);

// POST /api/comments/:productId delete a comment
router.delete("/:productId", requireAuth(), commentController.deleteComment);

export default router;
