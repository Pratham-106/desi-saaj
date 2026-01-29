import Order from "../models/orderModel.js";

/* ============================
   CREATE NEW ORDER
   POST /api/orders
============================ */
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,

      // ✅ Default status system
      status: "Placed",
      isDelivered: false,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

/* ============================
   GET USER ORDERS
   GET /api/orders/my-orders
============================ */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

/* ============================
   GET ALL ORDERS (ADMIN)
   GET /api/orders/admin/all
============================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/* ============================
   GET ORDER BY ID
   GET /api/orders/:id
============================ */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

/* ============================
   ✅ UPDATE ORDER STATUS (ADMIN)
   PUT /api/orders/:id/status
============================ */
export const updateOrderStatus = async (req, res) => {
  try {
    let { status } = req.body;
    status = status || "Placed";

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Normalize status properly
    order.status =
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase();

    // ✅ Sync Delivered Flags
    if ((status || "").toLowerCase() === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    await order.save();

    res.json({
      message: "Order status updated ✅",
      status: order.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

/* ============================
   MARK ORDER AS DELIVERED (ADMIN)
   PUT /api/orders/:id/deliver
============================ */
export const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Delivered";
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      message: "Order marked as delivered ✅",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
};

/* ============================
   ✅ DELETE ORDER (ADMIN ONLY)
   DELETE /api/orders/:id
============================ */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Only allow delete if status is Delivered
    if ((order.status || "").toLowerCase() !== "delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be deleted",
      });
    }

    await order.deleteOne();

    res.json({
      message: "Order deleted successfully ✅",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    res.status(500).json({
      message: "Server error deleting order",
      error: error.message,
    });
  }
};
