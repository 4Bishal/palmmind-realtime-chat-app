import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/messages/:userId
 */
router.get("/:userId", protect, getMessages);

export default router;