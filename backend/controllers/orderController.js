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

    if (orderItems && orderItems.length === 0) {
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
   GET /api/orders/myorders
============================ */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
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
   GET /api/orders
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

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
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

    // ✅ Treat Delivered if either system says delivered
    const statusDelivered =
      order.status?.toLowerCase() === "delivered";

    const flagDelivered = order.isDelivered === true;

    if (!statusDelivered && !flagDelivered) {
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
/* ============================
   ✅ UPDATE ORDER STATUS (ADMIN)
   PUT /api/orders/:id/status
============================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Update status
    order.status = status;

    // ✅ If Delivered → update delivered flags
    if (status.toLowerCase() === "delivered") {
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
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
