import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "./../../css/AdminDashboard.css";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    loading: true,
  });

  const [latestOrders, setLatestOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchStats(), fetchLatestOrders()]);
  };

  const fetchStats = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      const token = adminInfo.token;

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/orders/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        totalProducts: productsRes.data.length || 0,
        totalOrders: ordersRes.data.length || 0,
        totalUsers: usersRes.data.length || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchLatestOrders = async () => {
    setLoadingOrders(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      const token = adminInfo.token;
      const { data } = await axios.get(`${API}/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort by createdAt descending and take 5
      const latest = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setLatestOrders(latest);
    } catch (error) {
      console.error("Error fetching latest orders:", error);
      setLatestOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleRefresh = async () => {
    setStats((s) => ({ ...s, loading: true }));
    await fetchAll();
  };

  return (
    <AdminLayout>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to DesiSaaj Admin Panel.</p>
        </div>
        <div className="stats-actions">
          <button className="refresh-btn" onClick={handleRefresh}>Refresh</button>
        </div>
      </div>

      <div className="dashboard-cards">
        <Link to="/admin/products" className="dash-card link-card">
          <div className="card-title">Total Products</div>
          <div className="card-value">{stats.loading ? "..." : stats.totalProducts}</div>
        </Link>

        <Link to="/admin/orders" className="dash-card link-card">
          <div className="card-title">Total Orders</div>
          <div className="card-value">{stats.loading ? "..." : stats.totalOrders}</div>
        </Link>

        <Link to="/admin/users" className="dash-card link-card">
          <div className="card-title">Total Users</div>
          <div className="card-value">{stats.loading ? "..." : stats.totalUsers}</div>
        </Link>
      </div>

      <div className="latest-orders">
        <h2>Latest Orders</h2>
        {loadingOrders ? (
          <p>Loading latest orders...</p>
        ) : latestOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <table className="latest-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order._id}>
                  <td className="mono">{order._id.slice(-8)}</td>
                  <td>{order.user?.email || order.user?.name || '—'}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.paymentMethod}</td>
                  <td><span className={`status ${(order.status || "Placed").toLowerCase()}`}>{order.status || "Placed"}</span></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
