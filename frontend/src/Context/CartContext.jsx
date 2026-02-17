import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch cart from backend if logged in
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get("http://localhost:5001/api/cart");
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
    const token = localStorage.getItem("token");
    const existing = cart.find((p) => p.id === item.id);
    if (existing) {
      showToast(`${item.name || item.title} is already in your cart`);
      return;
    }

    if (token) {
      try {
        const res = await axios.post("http://localhost:5001/api/cart", {
          productId: item.id,
        });

        if (res.status === 200 && res.data.message === "Product already in cart") {
          showToast(res.data.message);
          return;
        }

        setCart((prev) => [...prev, { ...item, quantity: 1 }]);
        showToast(`${item.name || item.title} added to cart`);
      } catch (err) {
        console.error("Add to cart error:", err);
        showToast("Failed to add to cart");
      }
    } else {
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
      showToast(`${item.name || item.title} added to cart`);
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    const removedItem = cart.find((i) => i.id === id);

    if (token) {
      try {
        await axios.delete(`http://localhost:5001/api/cart/${id}`);
      } catch (err) {
        console.error("Remove from cart error:", err);
      }
    }

    showToast(`${removedItem?.name || removedItem?.title || "Item"} removed `);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared ");
  };

  const updateQuantity = async (id, action) => {
    const token = localStorage.getItem("token");
    let newQuantity = 1;

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          newQuantity = action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    if (token) {
      try {
        await axios.put("http://localhost:5001/api/cart", {
          productId: id,
          quantity: newQuantity,
        });
      } catch (err) {
        console.error("Update quantity error:", err);
      }
    }

    if (action === "increase") showToast("Quantity increased ");
    else showToast("Quantity decreased ");
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
