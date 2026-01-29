import { useCart } from "../context/cart/useCart";
import { useNavigate } from "react-router-dom";
import "./../css/CartPage.css";

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  /* ✅ SUBTOTAL */
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  /* ✅ DELIVERY (highest charge in cart) */
  const deliveryCharge =
    cart.length > 0
      ? Math.max(...cart.map((item) => item.deliveryCharge || 0))
      : 0;

  const total = subtotal + deliveryCharge;

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          {/* ✅ CART ITEMS */}
          <div className="cart-items">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={`${item._id}-${item.size}`}
              >
                {/* ✅ CLOUDINARY IMAGE DIRECT */}
                <img
                  src={item.images?.[0] || "/no-img.svg"}
                  alt={item.name}
                  onError={(e) => (e.target.src = "/no-img.svg")}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p className="cart-size">
                    Size: <strong>{item.size}</strong>
                  </p>

                  <p className="cart-price">₹{item.price}</p>

                  {/* ✅ QUANTITY CONTROLS */}
                  <div className="qty-controls">
                    <button
                      disabled={(item.qty || 1) === 1}
                      onClick={() =>
                        updateQty(
                          item._id,
                          item.size,
                          Math.max(1, (item.qty || 1) - 1)
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.qty || 1}</span>

                    <button
                      onClick={() =>
                        updateQty(
                          item._id,
                          item.size,
                          (item.qty || 1) + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* ✅ REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item._id, item.size)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ SUMMARY */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
              </span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
