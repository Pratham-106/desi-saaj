import Product from "../models/productModel.js";

/* ==============================
   ✅ ADD PRODUCT (ADMIN)
   POST /api/products/add
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
      tags = [],
    } = req.body;

    const allowedStock = ["IN_STOCK", "LIMITED", "OUT_OF_STOCK"];

    if (!allowedStock.includes(stockStatus)) {
      return res.status(400).json({ message: "Invalid stock status" });
    }

    /* ✅ Cloudinary Upload Fix */
    const images =
      req.files?.map((file) => file.path) || [];

    if (images.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
      });
    }

    const product = await Product.create({
      name,
      price,
      stockStatus,
      category,
      description,
      deliveryCharge,
      images,
      tags,
    });

    res.status(201).json({
      message: "Product added successfully ✅",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error adding product",
      error: error.message,
    });
  }
};

/* ==============================
   ✅ GET ALL PRODUCTS
   GET /api/products
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
   ✅ GET TRENDING PRODUCTS
   GET /api/products/trending
============================== */
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      tags: "TRENDING",
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ GET SINGLE PRODUCT
   GET /api/products/:id
============================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ DELETE PRODUCT (ADMIN)
   DELETE /api/products/:id
============================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    res.json({ message: "Product deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ UPDATE PRODUCT (ADMIN)
   PUT /api/products/:id
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
      tags,
    } = req.body;

    const allowedStock = ["IN_STOCK", "LIMITED", "OUT_OF_STOCK"];

    if (stockStatus && !allowedStock.includes(stockStatus)) {
      return res.status(400).json({ message: "Invalid stock status" });
    }

    /* ✅ Optional New Cloudinary Images */
    const newImages = req.files?.map((file) => file.path) || null;

    const updatedData = {
      name,
      price,
      stockStatus,
      category,
      description,
      deliveryCharge,
      tags,
    };

    /* ✅ Replace Images Only If Uploaded */
    if (newImages && newImages.length > 0) {
      updatedData.images = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({
      message: "Product updated successfully ✅",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ ADD COMMENT (USER)
============================== */
export const addProductComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment is required" });
    }

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    product.reviews.unshift({
      user: req.user._id,
      name: req.user.name,
      comment,
      likes: [],
    });

    await product.save();

    res.status(201).json({
      message: "Comment added ✅",
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ LIKE / UNLIKE COMMENT
============================== */
export const toggleCommentLike = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);

    if (!review)
      return res.status(404).json({ message: "Comment not found" });

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
      message: alreadyLiked ? "Like removed ✅" : "Comment liked ❤️",
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
