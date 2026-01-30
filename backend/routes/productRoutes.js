import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  addProduct,
  getProducts,
  getTrendingProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addProductComment,
  toggleCommentLike,
} from "../controllers/productController.js";

const router = express.Router();

/* ==============================
   ✅ ADD PRODUCT (ADMIN ONLY)
   POST /api/products/add
   ✅ LIMIT: 2 IMAGES ONLY
============================== */
router.post(
  "/add",
  protect,
  admin,
  upload.array("images", 2), // ✅ FIXED HERE
  addProduct
);

/* ==============================
   ✅ TRENDING PRODUCTS
============================== */
router.get("/trending", getTrendingProducts);

/* ==============================
   ✅ ALL PRODUCTS
============================== */
router.get("/", getProducts);

/* ==============================
   ✅ SINGLE PRODUCT
============================== */
router.get("/:id", getProductById);

/* ==============================
   ✅ COMMENT
============================== */
router.post("/:id/comment", protect, addProductComment);

/* ==============================
   ✅ LIKE COMMENT
============================== */
router.put(
  "/:productId/comment/:reviewId/like",
  protect,
  toggleCommentLike
);

/* ==============================
   ✅ UPDATE PRODUCT (ADMIN)
============================== */
router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 2),
  updateProduct
);

/* ==============================
   ✅ DELETE PRODUCT (ADMIN)
============================== */
router.delete("/:id", protect, admin, deleteProduct);

export default router;
