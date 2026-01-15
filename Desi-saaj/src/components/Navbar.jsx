import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/user/useUser";
import { useCart } from "../context/cart/useCart";
import "./../css/Navbar.css";

export default function Navbar() {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart?.length || 0;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
        <img src="/Des.png" alt="DesiSaaj Logo" className="logo-img" />
      </NavLink>

      {/* HAMBURGER FOR MOBILE */}
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`hamburger-line ${menuOpen ? "active" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "active" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "active" : ""}`} />
      </button>

      {/* NAV LINKS */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" end className="nav-link" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/shop" className="nav-link" onClick={closeMenu}>Shop</NavLink>
        <NavLink to="/cart" className="nav-link cart-link" onClick={closeMenu}>
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
        <NavLink to="/about" className="nav-link" onClick={closeMenu}>About</NavLink>
        <NavLink to="/contact" className="nav-link" onClick={closeMenu}>Contact</NavLink>
      </div>

      {/* USER / LOGIN / ADMIN SECTION */}
      <div className="nav-auth">
        {(() => {
          const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
          const isAdmin = adminInfo && adminInfo.isAdmin;
          const navigate = useNavigate();

          const handleAdminLogout = () => {
            localStorage.removeItem("adminInfo");
            navigate("/admin/login");
            window.location.reload();
          };

          if (isAdmin) {
            return (
              <div className="admin-section">
                <div className="admin-greeting">Welcome Admin</div>
                <NavLink to="/admin/dashboard" className="nav-btn admin-dashboard-btn">Dashboard</NavLink>
                <button onClick={handleAdminLogout} className="logout-btn">Logout</button>
              </div>
            );
          }

          return user ? (
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <div className="user-details">
                  <div className="user-greeting">Hi, {user.name}</div>
                  <NavLink to="/my-orders" className="view-orders">My Orders</NavLink>
                </div>
              </div>
              <button onClick={logout} className="logout-btn" title="Logout">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="nav-btn login-btn">Login</NavLink>
              <NavLink to="/register" className="nav-btn signup-btn">Sign Up</NavLink>
            </div>
          );
        })()}
      </div>

    </nav>
  );
}
