import { Routes, Route } from "react-router-dom";

/* =======================
   COMMON COMPONENTS
======================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

/* =======================
   PUBLIC PAGES
======================= */
import HomePages from "./pages/HomePages";
import ShopPages from "./pages/ShopPages";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

/* =======================
   AUTH PAGES
======================= */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/* =======================
   CHECKOUT
======================= */
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutAddressPage from "./pages/CheckoutAddressPage";
import CheckoutPaymentPage from "./pages/CheckoutPaymentPage";
import CheckoutPlaceOrderPage from "./pages/CheckoutPlaceOrderPage";

/* =======================
   USER
======================= */
import MyOrdersPage from "./pages/MyOrdersPage";

/* =======================
   ADMIN
======================= */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminContactMessages from "./pages/admin/AdminContactMessage";


/* =======================
   APP
======================= */
export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<HomePages />} />
        <Route path="/shop" element={<ShopPages />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* ---------- AUTH ---------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ---------- CHECKOUT (🔐 PROTECTED) ---------- */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout/address"
          element={
            <ProtectedRoute>
              <CheckoutAddressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout/payment"
          element={
            <ProtectedRoute>
              <CheckoutPaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout/place-order"
          element={
            <ProtectedRoute>
              <CheckoutPlaceOrderPage />
            </ProtectedRoute>
          }
        />

        {/* ---------- USER ---------- */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ---------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminProtectedRoute>
              <AdminAddProduct />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminProtectedRoute>
              <AdminEditProduct />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/contact-messages"
          element={
            <AdminProtectedRoute>
              <AdminContactMessages />
            </AdminProtectedRoute>
         }
        />

      </Routes>

      <Footer />
    </>
  );
}
