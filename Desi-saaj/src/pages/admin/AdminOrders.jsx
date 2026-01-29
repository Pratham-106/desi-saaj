import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import "./../../css/AdminOrders.css";

/* ✅ Deployment Safe API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

export default function AdminOrders() {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PLACED");

  /* ============================
     ✅ FETCH ALL ORDERS
  ============================ */
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/admin/all`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      setOrders(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ============================
     ✅ UPDATE ORDER STATUS
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

      toast.success("Status updated ✅");

      // ✅ Update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, orderStatus: data.orderStatus }
            : o
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  /* ============================
     ✅ DELETE ORDER (ONLY DELIVERED)
  ============================ */
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this delivered order permanently?")) return;

    try {
      await axios.delete(`${API}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      toast.success("Order deleted ✅");

      // ✅ Remove instantly
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  /* ============================
     ✅ FILTER BY STATUS
  ============================ */
  const placedOrders = orders.filter((o) => o.orderStatus === "PLACED");
  const processingOrders = orders.filter(
    (o) => o.orderStatus === "PROCESSING"
  );
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "DELIVERED"
  );

  const ordersForTab = () => {
    if (activeTab === "PLACED") return placedOrders;
    if (activeTab === "PROCESSING") return processingOrders;
    if (activeTab === "DELIVERED") return deliveredOrders;
    return [];
  };

  /* ============================
     ✅ RENDER ORDER CARD
  ============================ */
  const renderOrder = (order) => (
    <div key={order._id} className="admin-order-card">
      <h3>Order #{order._id.slice(-8)}</h3>

      <p>
        <strong>User:</strong> {order.user?.email}
      </p>

      <p>
        <strong>Total:</strong> ₹{order.totalPrice}
      </p>

      {/* ✅ STATUS DROPDOWN */}
      <select
        className="status-select"
        value={order.orderStatus}
        onChange={(e) =>
          handleStatusChange(order._id, e.target.value)
        }
      >
        <option value="PLACED">Placed</option>
        <option value="PROCESSING">Processing</option>
        <option value="DELIVERED">Delivered</option>
      </select>

      {/* ✅ ITEMS */}
      <div className="order-items">
        {(order.orderItems || []).map((item, idx) => (
          <div key={idx} className="order-item">
            <img
              src={
                item.image
                  ? `${BASE_URL}${item.image}`
                  : "/placeholder.png"
              }
              alt={item.name}
            />

            <div>
              <p>{item.name}</p>
              <p>
                ₹{item.price} × {item.qty}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ DELETE ONLY DELIVERED */}
      {order.orderStatus === "DELIVERED" && (
        <button
          className="delete-order-btn"
          onClick={() => handleDeleteOrder(order._id)}
        >
          🗑 Delete Delivered Order
        </button>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-orders-page">
        <h1>Orders Management</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <>
            {/* ✅ Tabs */}
            <div className="orders-tabs">
              <button onClick={() => setActiveTab("PLACED")}>
                📦 Placed ({placedOrders.length})
              </button>

              <button onClick={() => setActiveTab("PROCESSING")}>
                ⚙️ Processing ({processingOrders.length})
              </button>

              <button onClick={() => setActiveTab("DELIVERED")}>
                ✅ Delivered ({deliveredOrders.length})
              </button>
            </div>

            {/* ✅ Orders */}
            <div className="admin-orders-list">
              {ordersForTab().length === 0 ? (
                <p>No orders here.</p>
              ) : (
                ordersForTab().map(renderOrder)
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
