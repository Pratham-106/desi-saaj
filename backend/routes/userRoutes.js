import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,   // ✅ FIXED NAME
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   AUTH
========================= */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* =========================
   ADMIN ROUTES
========================= */

/**
 * @route   GET /api/users
 * @desc    Get all users (ADMIN)
 * @access  Admin
 */
router.get("/", protect, admin, getAllUsers);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (ADMIN)
 * @access  Admin
 */
router.delete("/:id", protect, admin, deleteUser);

export default router;
