import express from "express";
import {
  adminLogin,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================
   ADMIN LOGIN
============================ */
router.post("/login", adminLogin);

/* ============================
   USERS MANAGEMENT (ADMIN ONLY)
============================ */

// ✅ GET ALL USERS
router.get("/", protect, admin, getAllUsers);

// ✅ DELETE USER
router.delete("/:id", protect, admin, deleteUser);

export default router;
