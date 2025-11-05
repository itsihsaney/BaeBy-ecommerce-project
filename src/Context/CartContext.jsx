import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  //  Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  //  Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === item.id);
      if (existing) {
        showToast(`${item.name} quantity increased `);
        return prevCart.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        showToast(`${item.name} added to cart `);
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  

  //  Remove item
  const removeFromCart = (id) => {
    const removedItem = cart.find((i) => i.id === id);
    showToast(`${removedItem?.name || "Item"} removed `);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  //  Clear cart
  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared ");
  };

  //  Update quantity (increase/decrease)
  const updateQuantity = (id, action) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                action === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );

    if (action === "increase") showToast("Quantity increased ");
    else showToast("Quantity decreased ");
  };

  //  Custom Toast (without any package)
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "fixed bottom-8 right-8 bg-pink-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300";
    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => (toast.style.opacity = "1"), 50);
    // Fade out
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

//  Hook for easy access
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
