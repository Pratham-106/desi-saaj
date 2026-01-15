import { useNavigate } from "react-router-dom";
import { useCheckout } from "../context/checkout/useCheckout";
import "./../css/Checkout.css";

export default function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const { paymentMethod, setPaymentMethod } = useCheckout();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    navigate("/checkout/place-order");
  };

  return (
    <div className="checkout-page">
      <h1>Select Payment Method</h1>

      <form onSubmit={submitHandler} className="payment-form">
        {/* COD */}
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <div>
            <strong>Cash on Delivery</strong>
            <p>Pay when your order arrives</p>
          </div>
        </label>

        {/* ONLINE */}
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="ONLINE"
            checked={paymentMethod === "ONLINE"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <div>
            <strong>Online Payment</strong>
            <p className="muted">
              Payment gateway coming soon — order will be placed
              as pending
            </p>
          </div>
        </label>

        <button type="submit" className="continue-btn">
          Continue
        </button>
      </form>
    </div>
  );
}
