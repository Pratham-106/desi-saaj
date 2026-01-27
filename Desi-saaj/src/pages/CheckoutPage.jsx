import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart/useCart";
import "./../css/Checkout.css";

/* ✅ DEPLOYMENT SAFE API */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();

  /* ✅ Redirect if cart is empty (Safe) */
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // ✅ Prevent render until cart exists
  if (!cart || cart.length === 0) return null;

  /* ============================
     PRICE CALCULATIONS
  ============================ */
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const deliveryCharge = Math.max(
    ...cart.map((item) => item.deliveryCharge || 0),
    0
  );

  const total = subtotal + deliveryCharge;

  const handleProceedToAddress = () => {
    navigate("/checkout/address");
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* ✅ ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              key={`${item._id}-${item.size}`}
              className="checkout-item"
            >
              <img
                src={
                  item.images?.length > 0
                    ? `${BASE_URL}${item.images[0]}`
                    : "/no-img.svg"
                }
                alt={item.name}
              />

              <div>
                <p>{item.name}</p>
                <p>
                  Size: {item.size} | Qty: {item.qty || 1}
                </p>
                <p>
                  ₹{item.price} × {item.qty || 1}
                </p>
              </div>
            </div>
          ))}

          <hr />

          {/* ✅ TOTALS */}
          <div className="checkout-totals">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div>
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* ✅ ACTION */}
        <div className="checkout-actions">
          <button
            onClick={handleProceedToAddress}
            className="proceed-btn"
          >
            Continue to Address
          </button>
        </div>
      </div>
    </div>
  );
}
