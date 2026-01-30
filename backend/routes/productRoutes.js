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

/* =========================================
   ✅ MULTER + CLOUDINARY ERROR HANDLER
========================================= */
const uploadImages = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err) {
      console.error("🔥 IMAGE UPLOAD ERROR:", err);

      return res.status(400).json({
        message: "Image upload failed ❌",
        error: err.message,
      });
    }

    next();
  });
};

/*
  ==============================
  ✅ PRODUCT ROUTES
  ==============================
*/

/* ✅ ADD PRODUCT (ADMIN ONLY)
   POST /api/products/add
-------------------------------- */
router.post(
  "/add",
  protect,
  admin,
  uploadImages,
  addProduct
);

/* ✅ GET TRENDING PRODUCTS
   GET /api/products/trending
-------------------------------- */
router.get("/trending", getTrendingProducts);

/* ✅ GET ALL PRODUCTS
   GET /api/products
-------------------------------- */
router.get("/", getProducts);

/* ✅ GET SINGLE PRODUCT
   GET /api/products/:id
-------------------------------- */
router.get("/:id", getProductById);

/* ✅ ADD COMMENT (USER)
   POST /api/products/:id/comment
-------------------------------- */
router.post("/:id/comment", protect, addProductComment);

/* ✅ LIKE / UNLIKE COMMENT
   PUT /api/products/:productId/comment/:reviewId/like
-------------------------------- */
router.put(
  "/:productId/comment/:reviewId/like",
  protect,
  toggleCommentLike
);

/* ✅ UPDATE PRODUCT (ADMIN ONLY)
   PUT /api/products/:id
-------------------------------- */
router.put(
  "/:id",
  protect,
  admin,
  uploadImages,
  updateProduct
);

/* ✅ DELETE PRODUCT (ADMIN ONLY)
   DELETE /api/products/:id
-------------------------------- */
router.delete("/:id", protect, admin, deleteProduct);

export default router;
