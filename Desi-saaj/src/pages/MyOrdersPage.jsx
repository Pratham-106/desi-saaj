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
     🔐 Protect Page (Login Required)
  ============================ */
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

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

    fetchOrders();
  }, [user, navigate]);

  /* ============================
     UI Render
  ============================ */
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
              to={`/order/${order._id}`}
              key={order._id}
              className="order-card"
            >
              <div>
                <strong>Order ID:</strong> {order._id}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <div>
                <strong>Total:</strong> ₹{order.totalPrice}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${(order.status || "Placed").toLowerCase()}`}
                >
                  {order.status || "Placed"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
