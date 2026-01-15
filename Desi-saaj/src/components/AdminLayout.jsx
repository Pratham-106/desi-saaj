import { NavLink, useNavigate } from "react-router-dom";
import "./../css/AdminLayout.css";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logoutHandler = () => {
    try {
      localStorage.removeItem("adminInfo");
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <h2 className="admin-logo">DesiSaaj Admin</h2>
        </div>

        <nav className="admin-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            📊 Dashboard
          </NavLink>
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            📦 Products
          </NavLink>
          <NavLink 
            to="/admin/add-product" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            ➕ Add Product
          </NavLink>
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            📋 Orders
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            👥 Users
          </NavLink>
          <NavLink 
       to="/admin/contact-messages" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          📩 Contact Messages
        </NavLink>
        </nav>
         

        {/* LOGOUT BUTTON */}
        <button className="admin-logout-btn" onClick={logoutHandler}>
          🚪 Logout
        </button>

       
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}

