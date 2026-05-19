import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/users
 */
router.get("/", protect, getAllUsers);

/**
 * GET /api/users/:id
 */
router.get("/:id", protect, getUserById);

/**
 * PUT /api/users/:id
 */
router.put("/:id", protect, updateUser);

/**
 * DELETE /api/users/:id
 */
router.delete("/:id", protect, deleteUser);

export default router;