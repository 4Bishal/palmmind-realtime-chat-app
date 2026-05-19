import express from "express";
import { getAllUsers } from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/users
 */
router.get("/", protect, getAllUsers);

export default router;