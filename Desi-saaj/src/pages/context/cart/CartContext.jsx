import { createContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  /* SAVE CART */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ADD TO CART (SIZE AWARE) */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item._id === product._id &&
          item.size === product.size
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id &&
          item.size === product.size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item._id === id && item.size === size)
      )
    );
  };

  const updateQty = (id, size, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && item.size === size
          ? { ...item, qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
