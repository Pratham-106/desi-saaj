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
      return res.status(400).json({
        message: "Invalid stock status",
      });
    }

    /* ✅ Must receive images */
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Image upload failed",
        error: "No images received",
      });
    }

    /* ✅ Cloudinary gives direct URL in file.path */
    const images = req.files.map((file) => file.path);

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
      message: "✅ Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(400).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
};

/* ==============================
   ✅ GET ALL PRODUCTS
============================== */
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ TRENDING PRODUCTS
============================== */
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ tags: "TRENDING" })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ GET PRODUCT BY ID
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
   ✅ DELETE PRODUCT
============================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    res.json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   ✅ UPDATE PRODUCT
============================== */
export const updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    /* ✅ Optional new images */
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.path);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({
      message: "✅ Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
