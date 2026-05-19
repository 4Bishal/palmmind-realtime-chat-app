import express from "express";
import { getStats } from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/stats
 */
router.get("/", protect, getStats);

export default router;