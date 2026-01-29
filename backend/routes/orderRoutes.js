import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================
   CREATE ORDER
============================ */
router.post("/", protect, createOrder);

/* ============================
   USER ORDERS
============================ */
router.get("/my-orders", protect, getMyOrders);

/* ============================
   ADMIN: ALL ORDERS
============================ */
router.get("/admin/all", protect, admin, getAllOrders);

/* ============================
   ADMIN: UPDATE STATUS
============================ */
router.put("/:id/status", protect, admin, updateOrderStatus);

/* ============================
   ADMIN: DELETE DELIVERED ORDER
============================ */
router.delete("/:id", protect, admin, deleteOrder);

/* ============================
   USER: ORDER BY ID (LAST)
============================ */
router.get("/:id", protect, getOrderById);

export default router;
