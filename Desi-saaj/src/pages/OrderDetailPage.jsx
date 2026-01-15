import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/user/useUser";
import "./../css/OrderDetailPage.css";

/* ✅ DEPLOYMENT SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");


export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${API}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrder();

    /* 🔁 Poll for updates every 8 seconds */
    const interval = setInterval(fetchOrder, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, user, navigate]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  const statusSteps = ["Placed", "Processing", "Delivered"];
  const currentStatusIndex = Math.max(
    0,
    statusSteps.findIndex(
      (s) => s.toLowerCase() === (order.status || "").toLowerCase()
    )
  );

  return (
    <div className="order-detail">
      <h1>Order Details</h1>

      <div className="order-box">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="status">{order.status}</span>
        </p>

        {/* STATUS TIMELINE */}
        <div className="status-timeline">
          {statusSteps.map((step, idx) => (
            <div
              key={step}
              className={`step ${idx <= currentStatusIndex ? "active" : ""}`}
            >
              <div className="dot">
                {idx < currentStatusIndex ? "✓" : idx + 1}
              </div>
              <div className="label">{step}</div>
              {idx < statusSteps.length - 1 && (
                <div className="connector" />
              )}
            </div>
          ))}
        </div>
      </div>

      <h2>Items</h2>

      {order.orderItems.map((item, index) => (
        <div className="order-item" key={index}>
          <img
            src={`${API.replace("/api", "")}${item.image}`}
            alt={item.name}
          />
          <div>
            <h4>{item.name}</h4>
            <p>Qty: {item.qty}</p>
            <p>Price: ₹{item.price}</p>
          </div>
        </div>
      ))}

      <div className="order-summary">
        <p>Delivery: ₹{order.deliveryCharge}</p>
        <h3>Total: ₹{order.totalPrice}</h3>
      </div>
    </div>
  );
}
