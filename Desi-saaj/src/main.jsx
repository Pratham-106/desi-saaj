import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import CheckoutProvider from "./context/checkout/CheckoutProvider";
import UserProvider from "./context/user/UserProvider";
import { CartProvider } from "./context/cart/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <UserProvider>
          <CheckoutProvider>
            <App />

            {/* 🔔 TOAST NOTIFICATIONS */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#e9f5ec",
                  color: "#1f4d2c",
                  fontWeight: "500",
                },
              }}
            />
          </CheckoutProvider>
        </UserProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
