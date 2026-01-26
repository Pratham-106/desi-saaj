import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderDelivered,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================
   CREATE ORDER
   POST /api/orders
============================ */
router.post("/", protect, createOrder);

/* ============================
   USER ORDERS
   GET /api/orders/my-orders ✅
============================ */
router.get("/my-orders", protect, getMyOrders);
router.get("/myorders", protect, getMyOrders);

/* ============================
   ✅ ADMIN ROUTES FIRST (IMPORTANT)
============================ */

/* ✅ ADMIN: GET ALL ORDERS */
router.get("/admin/all", protect, admin, getAllOrders);

/* ✅ ADMIN: GET ALL ORDERS (Standard) */
router.get("/", protect, admin, getAllOrders);

/* ✅ ADMIN: MARK DELIVERED */
router.put("/:id/deliver", protect, admin, markOrderDelivered);

/* ✅ ADMIN: DELETE DELIVERED ORDER */
router.delete("/:id", protect, admin, deleteOrder);

router.put("/:id/status", protect, admin, updateOrderStatus);


/* ============================
   USER: GET ORDER BY ID (LAST)
   GET /api/orders/:id
============================ */
router.get("/:id", protect, getOrderById);

export default router;
