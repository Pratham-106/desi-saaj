import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminOrders.css";
import toast from "react-hot-toast";

/* ✅ Deployment Safe API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

export default function AdminOrders() {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
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

      toast.success("Order deleted ✅");

      // ✅ Remove instantly
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* ============================
     ✅ SAFE GROUPING BY STATUS
  ============================ */
  const placedOrders = orders.filter(
    (o) => (o.status || "Placed").toLowerCase() === "placed"
  );

  const processingOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "processing"
  );

  const deliveredOrders = orders.filter(
    (o) => (o.status || "").toLowerCase() === "delivered"
  );

  const getOrdersForTab = () => {
    if (activeTab === "placed") return placedOrders;
    if (activeTab === "processing") return processingOrders;
    if (activeTab === "delivered") return deliveredOrders;
    return [];
  };

  /* ============================
     RENDER ORDER CARD
  ============================ */
  const renderOrderCard = (order) => {
    const status = (order.status || "Placed").toLowerCase();

    return (
      <div key={order._id} className="admin-order-card">
        <h3>Order #{order._id.slice(-8)}</h3>

        <p>
          <strong>User:</strong> {order.user?.email}
        </p>

        <p>
          <strong>Total:</strong> ₹{order.totalPrice}
        </p>

        {/* ✅ Status Dropdown */}
        <select
          value={order.status || "Placed"}
          onChange={(e) =>
            handleStatusChange(order._id, e.target.value)
          }
          className="status-select"
        >
          <option value="Placed">Placed</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
        </select>

        {/* ✅ Items */}
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

        {/* ✅ Delete Button Only If Delivered */}
        {status === "delivered" && (
          <button
            className="delete-order-btn"
            onClick={() => handleDeleteOrder(order._id)}
          >
            🗑 Delete Delivered Order
          </button>
        )}
      </div>
    );
  };

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
              <button onClick={() => setActiveTab("placed")}>
                📦 Placed ({placedOrders.length})
              </button>

              <button onClick={() => setActiveTab("processing")}>
                ⚙️ Processing ({processingOrders.length})
              </button>

              <button onClick={() => setActiveTab("delivered")}>
                ✅ Delivered ({deliveredOrders.length})
              </button>
            </div>

            {/* ✅ Orders List */}
            <div className="admin-orders-list">
              {getOrdersForTab().length === 0 ? (
                <p>No orders in this tab.</p>
              ) : (
                getOrdersForTab().map(renderOrderCard)
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
