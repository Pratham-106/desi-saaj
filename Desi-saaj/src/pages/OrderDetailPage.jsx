import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/user/useUser";
import "./../css/OrderDetailPage.css";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!cancelled) {
          setOrder(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrder();

    // Poll for updates every 8 seconds while on the page
    const interval = setInterval(fetchOrder, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, user]);

  if (loading) return <p>Loading order...</p>;

  const statusSteps = ["Placed", "Processing", "Delivered"];
  const currentStatusIndex = Math.max(
    0,
    statusSteps.findIndex((s) => s.toLowerCase() === (order.status || "").toLowerCase())
  );

  return (
    <div className="order-detail">
      <h1>Order Details</h1>

      <div className="order-box">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className="status">{order.status}</span></p>

        <div className="status-timeline">
          {statusSteps.map((step, idx) => (
            <div key={step} className={`step ${idx <= currentStatusIndex ? "active" : ""}`}>
              <div className="dot">{idx < currentStatusIndex ? "✓" : idx + 1}</div>
              <div className="label">{step}</div>
              {idx < statusSteps.length - 1 && <div className="connector" />}
            </div>
          ))}
        </div>
      </div>

      <h2>Items</h2>

      {order.orderItems.map((item, index) => (
        <div className="order-item" key={index}>
          <img src={`http://localhost:5000${item.image}`} alt={item.name} />
          <div>
            <h4>{item.name}</h4>
            <p>Qty: {item.quantity}</p>
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
