import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/user/useUser";
import { Link } from "react-router-dom";
import "./../css/MyOrdersPage.css";

export default function MyOrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

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
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
