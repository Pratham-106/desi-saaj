import express from "express";
import {
  adminLogin,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔐 ADMIN LOGIN */
router.post("/login", adminLogin);

/* 👥 GET ALL USERS (ADMIN) */
router.get("/users", protectAdmin, getAllUsers);

/* 🗑 DELETE USER (ADMIN) */
router.delete("/users/:id", protectAdmin, deleteUser);

export default router;
