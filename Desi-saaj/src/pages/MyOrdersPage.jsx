import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/user/useUser";
import { Link, useNavigate } from "react-router-dom";
import "./../css/MyOrdersPage.css";

/* ✅ Deployment Safe API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyOrdersPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     ✅ FETCH USER ORDERS
  ============================ */
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setOrders(data || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     ✅ AUTO REFRESH ORDERS
  ============================ */
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    fetchOrders();

    // ✅ Refresh every 6 seconds
    const interval = setInterval(fetchOrders, 6000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}
              className="order-card"
            >
              <div>
                <strong>Order ID:</strong> {order._id.slice(-8)}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <div>
                <strong>Total:</strong> ₹{order.totalPrice}
              </div>

              {/* ✅ STATUS (orderStatus Field) */}
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${(
                    order.orderStatus || "PLACED"
                  ).toLowerCase()}`}
                >
                  {order.orderStatus || "PLACED"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
