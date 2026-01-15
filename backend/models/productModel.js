import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    price: { type: Number, required: true },

    stockStatus: {
      type: String,
      enum: ["IN_STOCK", "LIMITED", "OUT_OF_STOCK"],
      default: "IN_STOCK",
    },

    category: { type: String, required: true },

    description: { type: String, required: true },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    /* 🔥 TAG SYSTEM (TRENDING, FEATURED, etc.) */
    tags: {
      type: [String],
      default: [],
    },

    /* 💬 PRODUCT REVIEWS / COMMENTS */
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
