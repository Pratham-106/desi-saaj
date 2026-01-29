import Order from "../models/orderModel.js";

/* ============================
   ✅ CREATE ORDER
============================ */
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
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
      deliveryCharge,
      totalPrice,

      orderStatus: "PLACED",
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
   ✅ GET MY ORDERS
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
   ✅ ADMIN: GET ALL ORDERS
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
   ✅ GET ORDER BY ID
============================ */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

/* ============================
   ✅ ADMIN: UPDATE ORDER STATUS
============================ */
export const updateOrderStatus = async (req, res) => {
  try {
    let { status } = req.body;

    status = (status || "PLACED").toUpperCase();

    const allowed = ["PLACED", "PROCESSING", "DELIVERED"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Save properly
    order.orderStatus = status;

    // ✅ Sync delivery flags
    if (status === "DELIVERED") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    await order.save();

    res.json({
      message: "Order status updated ✅",
      order, // ✅ Return FULL order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

/* ============================
   ✅ ADMIN: DELETE DELIVERED ORDER
============================ */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if ((order.orderStatus || "").toUpperCase() !== "DELIVERED") {
      return res.status(400).json({
        message: "Only delivered orders can be deleted",
      });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({
      message: "Server error deleting order",
      error: error.message,
    });
  }
};
