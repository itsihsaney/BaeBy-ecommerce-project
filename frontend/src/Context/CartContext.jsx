import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch cart from backend if logged in
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("userInfo");
      if (token) {
        try {
          const { data } = await api.get("/api/cart");
          const formattedCart = data.map((item) => ({
            ...item.product,
            id: item.product.id,
            dbId: item.id,
            quantity: item.quantity,
          }));
          setCart(formattedCart);
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (item) => {
    const token = localStorage.getItem("token") || localStorage.getItem("userInfo");

    // Optimistic UI Update first
    const existing = cart.find((p) => p.id === item.id);
    if (existing) {
      showToast(`${item.name || item.title} is already in your cart`);
      return;
    }

    // Add to local state immediately
    const newItem = { ...item, quantity: 1 };
    setCart((prev) => [...prev, newItem]);
    showToast(`${item.name || item.title} added to cart`);

    if (token) {
      try {
        const res = await api.post("/api/cart", {
          productId: item.id,
        });

        if (res.status === 200 && res.data.message === "Product already in cart") {
          // If backend says duplicate, we are good (we handled it locally already mostly)
          return;
        }
      } catch (err) {
        console.error("Add to cart error:", err);
        showToast("Failed to sync with server");
        // Revert local state if server fails
        setCart((prev) => prev.filter((p) => p.id !== item.id));
      }
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token") || localStorage.getItem("userInfo");
    const removedItem = cart.find((i) => i.id === id);

    // Optimistic UI Update
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast(`${removedItem?.name || removedItem?.title || "Item"} removed`);

    if (token) {
      try {
        await api.delete(`/api/cart/${id}`);
      } catch (err) {
        console.error("Remove from cart error:", err);
        // Optionally revert state here if strict sync is needed
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared");
  };

  const updateQuantity = async (id, action) => {
    const token = localStorage.getItem("token") || localStorage.getItem("userInfo");
    let newQuantity = 1;

    // Calculate new quantity based on current state
    const currentItem = cart.find(item => item.id === id);
    if (!currentItem) return;

    if (action === "increase") {
      newQuantity = currentItem.quantity + 1;
    } else {
      newQuantity = Math.max(1, currentItem.quantity - 1);
    }

    // Optimistic UI Update
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    if (action === "increase") showToast("Quantity increased");
    else showToast("Quantity decreased");

    if (token) {
      try {
        await api.put("/api/cart", {
          productId: id,
          quantity: newQuantity, // Send the calculated value
        });
      } catch (err) {
        console.error("Update quantity error:", err);
        // Revert on error?
      }
    }
  };

  //  Custom Toast 
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
