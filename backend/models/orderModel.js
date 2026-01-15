import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    /* =====================
       USER
    ====================== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* =====================
       ORDER ITEMS
    ====================== */
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        size: { type: String },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    /* =====================
       SHIPPING
    ====================== */
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    /* =====================
       PAYMENT (GATEWAY READY)
    ====================== */
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    paymentResult: {
      id: String,       // Razorpay payment_id (later)
      status: String,   // captured / failed
      email: String,    // payer email
    },

    /* =====================
       PRICE
    ====================== */
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    /* =====================
       ORDER STATUS
    ====================== */
    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
