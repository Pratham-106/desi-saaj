import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderDelivered,
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
router.get("/myorders", protect, getMyOrders);

/* ============================
   ADMIN: GET ALL ORDERS
============================ */
router.get("/", protect, admin, getAllOrders);

/* ============================
   ADMIN: DELETE DELIVERED ORDER
============================ */
router.delete("/:id", protect, admin, deleteOrder);

/* ============================
   GET ORDER BY ID
============================ */
router.get("/:id", protect, getOrderById);

/* ============================
   ADMIN: MARK DELIVERED
============================ */
router.put("/:id/deliver", protect, admin, markOrderDelivered);

export default router;
