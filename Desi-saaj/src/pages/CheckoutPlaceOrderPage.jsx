import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart/useCart";
import { useCheckout } from "../context/checkout/useCheckout";
import { useUser } from "../context/user/useUser";
import "./../css/Checkout.css";

export default function CheckoutPlaceOrderPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { address, paymentMethod, clearCheckout } = useCheckout();
  const { user } = useUser();

  /* 🔐 HARD GUARD: user must exist */
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  /* ⛔ INVALID STATE */
  if (!cart.length || !address) {
    return (
      <div className="checkout-page">
        <p>Invalid checkout state. Redirecting...</p>
      </div>
    );
  }

  const itemsPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const deliveryCharge =
    cart.length > 0
      ? Math.max(...cart.map((item) => item.deliveryCharge || 0))
      : 0;

  const totalPrice = itemsPrice + deliveryCharge;

  const handlePlaceOrder = async () => {
    /* 🔐 FINAL DEFENSE */
    if (!user || !user.token) {
      alert("Please login to place an order");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems: cart.map((item) => ({
            name: item.name,
            price: item.price,
            qty: item.qty || 1,
            size: item.size,
            image: item.images[0],
            product: item._id,
          })),
          shippingAddress: address,
          paymentMethod: paymentMethod || "COD",
          itemsPrice,
          deliveryCharge,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data?._id) {
        clearCart();
        clearCheckout();

        if (paymentMethod === "ONLINE") {
          alert(
            "Order placed successfully!\n\nOnline payment is pending and will be completed once the payment gateway is live."
          );
        } else {
          alert("Order placed successfully! 🎉");
        }

        navigate("/my-orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-page">
      <h1>Confirm Order</h1>

      <div className="checkout-layout">
        {/* ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>Order Review</h2>

          {cart.map((item) => (
            <div
              key={`${item._id}-${item.size}`}
              className="checkout-item"
            >
              <img
                src={`http://localhost:5000${item.images[0]}`}
                alt={item.name}
              />
              <div>
                <p>{item.name}</p>
                <p>
                  Size: {item.size} | Qty: {item.qty || 1}
                </p>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))}

          <hr />

          {/* ADDRESS */}
          <div className="checkout-address">
            <h3>Delivery Address</h3>
            <p>{address.name}</p>
            <p>
              {address.address}, {address.city}, {address.state}{" "}
              {address.pincode}
            </p>
            <p>Phone: {address.phone}</p>
          </div>

          <hr />

          {/* PAYMENT */}
          <div className="checkout-payment">
            <h3>Payment Method</h3>
            <p>
              {paymentMethod === "ONLINE"
                ? "Online Payment (Pending)"
                : "Cash on Delivery"}
            </p>
          </div>

          <hr />

          {/* TOTALS */}
          <div className="checkout-totals">
            <div>
              <span>Subtotal</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0
                  ? "Free"
                  : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="checkout-actions">
          <button
            onClick={handlePlaceOrder}
            className="place-order-btn"
          >
            Place Order
          </button>

          <button
            onClick={() => navigate("/checkout/payment")}
            className="back-btn"
          >
            Back to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
