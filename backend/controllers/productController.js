import Product from "../models/productModel.js";

/* ==============================
   ADD PRODUCT (ADMIN)
============================== */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      stockStatus,
      category,
      description,
      deliveryCharge,
      tags = [], // 🔥 NEW
    } = req.body;

    const allowedStock = ["IN_STOCK", "LIMITED", "OUT_OF_STOCK"];

    if (!allowedStock.includes(stockStatus)) {
      return res.status(400).json({ message: "Invalid stock status" });
    }

    const images =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const product = await Product.create({
      name,
      price,
      stockStatus,
      category,
      description,
      deliveryCharge,
      images,
      tags, // 🔥 SAVE TAGS
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   GET ALL PRODUCTS
============================== */
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   GET TRENDING PRODUCTS
============================== */
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      tags: "TRENDING",
    })
      .sort({ createdAt: -1 })
      .limit(8); // 🔥 limit for homepage

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   GET SINGLE PRODUCT
============================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   DELETE PRODUCT (ADMIN)
============================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   UPDATE PRODUCT (ADMIN)
============================== */
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      stockStatus,
      category,
      description,
      deliveryCharge,
      tags, // 🔥 NEW
    } = req.body;

    const allowedStock = ["IN_STOCK", "LIMITED", "OUT_OF_STOCK"];

    if (stockStatus && !allowedStock.includes(stockStatus)) {
      return res.status(400).json({ message: "Invalid stock status" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        stockStatus,
        category,
        description,
        deliveryCharge,
        tags, // 🔥 UPDATE TAGS
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ADD COMMENT / REVIEW (USER)
============================== */
export const addProductComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const productId = req.params.id;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = {
      user: req.user._id,
      name: req.user.name,
      comment,
      likes: [],
    };

    product.reviews.unshift(newReview); // latest first
    await product.save();

    res.status(201).json({
      message: "Comment added successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   LIKE / UNLIKE COMMENT (USER)
============================== */
export const toggleCommentLike = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = review.likes
      .map((id) => id.toString())
      .includes(userId);

    if (alreadyLiked) {
      review.likes = review.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      review.likes.push(req.user._id);
    }

    await product.save();

    res.json({
      message: alreadyLiked ? "Like removed" : "Comment liked",
      likesCount: review.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
