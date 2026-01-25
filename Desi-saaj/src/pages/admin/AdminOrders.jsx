import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminOrders.css";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminOrders() {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("placed");

  /* ============================
     FETCH ALL ORDERS (ADMIN)
  ============================ */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API}/orders/admin/all`, {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        });

        setOrders(data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unauthorized or failed to fetch orders");
        setLoading(false);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  /* ============================
     UPDATE ORDER STATUS
  ============================ */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `${API}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: data.status } : o
        )
      );

      toast.success("Order status updated ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  /* ============================
     ✅ DELETE DELIVERED ORDER
  ============================ */
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this delivered order permanently?")) return;

    try {
      await axios.delete(`${API}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      toast.success("Order deleted successfully ✅");

      // ✅ Remove order instantly from UI
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  /* ============================
     GROUP ORDERS BY STATUS
  ============================ */
  const placedOrders = orders.filter(
    (o) => !o.status || o.status.toLowerCase() === "placed"
  );

  const processingOrders = orders.filter(
    (o) => o.status && o.status.toLowerCase() === "processing"
  );

  const deliveredOrders = orders.filter(
    (o) => o.status && o.status.toLowerCase() === "delivered"
  );

  const getOrdersForTab = () => {
    switch (activeTab) {
      case "placed":
        return placedOrders;
      case "processing":
        return processingOrders;
      case "delivered":
        return deliveredOrders;
      default:
        return [];
    }
  };

  /* ============================
     RENDER ORDER CARD
  ============================ */
  const renderOrderCard = (order) => (
    <div key={order._id} className="admin-order-card">
      <div className="order-row">
        <span>Order ID:</span>
        <span className="order-id">{order._id.slice(-8)}</span>
      </div>

      <div className="order-row">
        <span>User:</span>
        <span>{order.user?.email}</span>
      </div>

      <div className="order-row">
        <span>Phone:</span>
        <span>{order.shippingAddress?.phone || "N/A"}</span>
      </div>

      <div className="order-row">
        <span>Address:</span>
        <span>{order.shippingAddress?.address || "N/A"}</span>
      </div>

      <div className="order-row">
        <span>Payment:</span>
        <span>{order.paymentMethod || "N/A"}</span>
      </div>

      <div className="order-row">
        <span>Total:</span>
        <span className="order-total">₹{order.totalPrice || 0}</span>
      </div>

      <div className="order-row">
        <span>Date:</span>
        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
      </div>

      {/* ✅ Status Dropdown */}
      <div className="order-row">
        <span>Status:</span>
        <span>
          <select
            className="status-select"
            value={order.status || "Placed"}
            onChange={(e) =>
              handleStatusChange(order._id, e.target.value)
            }
          >
            <option value="Placed">Placed</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
          </select>
        </span>
      </div>

      {/* ✅ Order Items */}
      <div className="order-items">
        <h4>Items</h4>
        {(order.orderItems || []).map((item, index) => (
          <div key={index} className="order-item">
            <img
              src={`http://localhost:5000${item.image || ""}`}
              alt={item.name || "Item"}
            />
            <div>
              <p>{item.name || "Unknown"}</p>
              <p>
                ₹{item.price || 0} × {item.qty || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ DELETE BUTTON ONLY FOR DELIVERED */}
      {order.status?.toLowerCase() === "delivered" && (
        <button
          className="delete-order-btn"
          onClick={() => handleDeleteOrder(order._id)}
        >
          🗑️ Delete Delivered Order
        </button>
      )}
    </div>
  );

  /* ============================
     MAIN RETURN UI
  ============================ */
  return (
    <AdminLayout>
      <div className="admin-orders-page">
        <div className="orders-header">
          <h1>Orders Management</h1>
          <p>Track and manage all customer orders</p>
        </div>

        {loading && <p className="loading-text">Loading orders...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && orders.length === 0 && (
          <div className="no-orders">
            <p>No orders found yet.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <>
            {/* ✅ Tabs */}
            <div className="orders-tabs">
              <button
                className={`tab-btn ${
                  activeTab === "placed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("placed")}
              >
                📦 Placed
                <span className="tab-count">{placedOrders.length}</span>
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "processing" ? "active" : ""
                }`}
                onClick={() => setActiveTab("processing")}
              >
                ⚙️ Processing
                <span className="tab-count">
                  {processingOrders.length}
                </span>
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "delivered" ? "active" : ""
                }`}
                onClick={() => setActiveTab("delivered")}
              >
                ✅ Delivered
                <span className="tab-count">
                  {deliveredOrders.length}
                </span>
              </button>
            </div>

            {/* ✅ Orders Section */}
            <div className="orders-section">
              {getOrdersForTab().length === 0 ? (
                <p className="empty-section">
                  No {activeTab} orders yet.
                </p>
              ) : (
                <div className="admin-orders-list">
                  {getOrdersForTab().map(renderOrderCard)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
