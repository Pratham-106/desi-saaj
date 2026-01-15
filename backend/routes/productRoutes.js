import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
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

/*
  ==============================
  PRODUCT ROUTES
  ==============================
*/

/**
 * @route   POST /api/products/add
 * @desc    Add new product (ADMIN)
 * @access  Admin
 */
router.post(
  "/add",
  upload.array("images", 5),
  addProduct
);

/**
 * @route   GET /api/products/trending
 * @desc    Get trending products
 * @access  Public
 */
router.get("/trending", getTrendingProducts);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product (with comments)
 * @access  Public
 */
router.get("/:id", getProductById);

/**
 * @route   POST /api/products/:id/comment
 * @desc    Add comment to product
 * @access  Private (User)
 */
router.post("/:id/comment", protect, addProductComment);

/**
 * @route   PUT /api/products/:productId/comment/:reviewId/like
 * @desc    Like / Unlike a comment
 * @access  Private (User)
 */
router.put(
  "/:productId/comment/:reviewId/like",
  protect,
  toggleCommentLike
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (ADMIN)
 * @access  Admin
 */
router.put("/:id", updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (ADMIN)
 * @access  Admin
 */
router.delete("/:id", deleteProduct);

export default router;
