import { useState } from "react";
import { CheckoutContext } from "./CheckoutContext";

export default function CheckoutProvider({ children }) {
  const [address, setAddress] = useState(() => {
    const stored = localStorage.getItem("checkoutAddress");
    return stored ? JSON.parse(stored) : null;
  });

  const [paymentMethod, setPaymentMethodState] = useState(() => {
    const stored = localStorage.getItem("paymentMethod");
    return stored || "COD";
  });

  const saveAddress = (data) => {
    localStorage.setItem("checkoutAddress", JSON.stringify(data));
    setAddress(data);
  };

  const clearCheckout = () => {
    localStorage.removeItem("checkoutAddress");
    localStorage.removeItem("paymentMethod");
    setAddress(null);
    setPaymentMethodState("COD");
  };

  const setPaymentMethod = (method) => {
    localStorage.setItem("paymentMethod", method);
    setPaymentMethodState(method);
  };

  return (
    <CheckoutContext.Provider
      value={{
        address,
        setAddress,
        paymentMethod,
        setPaymentMethod,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
