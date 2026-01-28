import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  markOrderDelivered,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================
   CREATE ORDER
   POST /api/orders
============================ */
router.post("/", protect, createOrder);

/* ============================
   USER: MY ORDERS
   GET /api/orders/my-orders ✅
============================ */
router.get("/my-orders", protect, getMyOrders);

/* ============================
   ✅ ADMIN ROUTES FIRST (IMPORTANT)
============================ */

/* ✅ ADMIN: GET ALL ORDERS */
router.get("/admin/all", protect, admin, getAllOrders);

/* ✅ ADMIN: UPDATE STATUS */
router.put("/:id/status", protect, admin, updateOrderStatus);

/* ✅ ADMIN: MARK DELIVERED */
router.put("/:id/deliver", protect, admin, markOrderDelivered);

/* ✅ ADMIN: DELETE DELIVERED ORDER */
router.delete("/:id", protect, admin, deleteOrder);

/* ============================
   USER: GET ORDER BY ID (LAST)
   GET /api/orders/:id
============================ */
router.get("/:id", protect, getOrderById);

export default router;
