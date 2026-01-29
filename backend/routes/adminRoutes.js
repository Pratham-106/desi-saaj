import express from "express";
import {
  adminLogin,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ✅ Admin Login */
router.post("/login", adminLogin);

/* ✅ Admin: Get All Users */
router.get("/users", protect, admin, getAllUsers);

/* ✅ Admin: Delete User */
router.delete("/users/:id", protect, admin, deleteUser);

export default router;
