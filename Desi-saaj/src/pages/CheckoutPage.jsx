import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart/useCart";
import { useUser } from "../context/user/useUser";
import "./../css/Checkout.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useUser();

  /* Redirect if cart is empty */
  if (!cart.length) {
    navigate("/cart");
    return null;
  }

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
        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={`${item._id}-${item.size}`} className="checkout-item">
              <img
                src={`http://localhost:5000${item.images[0]}`}
                alt={item.name}
              />
              <div>
                <p>{item.name}</p>
                <p>Size: {item.size} | Qty: {item.qty || 1}</p>
                <p>₹{item.price} x {item.qty || 1}</p>
              </div>
            </div>
          ))}

          <hr />
          <div className="checkout-totals">
            <div>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div className="checkout-actions">
          <button onClick={handleProceedToAddress} className="proceed-btn">
            Continue to Address
          </button>
        </div>
      </div>
    </div>
  );
}
