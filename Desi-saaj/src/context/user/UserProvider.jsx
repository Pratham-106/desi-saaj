import { useState } from "react";
import { UserContext } from "./UserContext";
import { useCart } from "../cart/useCart";

export default function UserProvider({ children }) {
  const storedUser = localStorage.getItem("userInfo");

  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );

  const { clearCart } = useCart();

  const login = (data) => {
    // 🔐 clear cart from previous session
    clearCart();

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);

    // 🔥 FIX: clear cart on logout
    clearCart();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
