import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const API_URL = "http://localhost:5001/users";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Keep user in sync with localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Register
  const register = async (userData) => {
    try {
      const { data: users } = await axios.get(API_URL);
      const exists = users.some((u) => u.email === userData.email);

      if (exists) return { success: false, message: "Email already registered" };

      const newUser = { id: Date.now(), ...userData };
      await axios.post(API_URL, newUser);

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      return { success: true, message: "Registration successful" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data: users } = await axios.get(API_URL);
      const found = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!found)
        return { success: false, message: "Invalid email or password" };

      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));

      return { success: true, user: found };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  // Logout  clear everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    if (clearCart) clearCart();
    if (clearWishlist) clearWishlist();

    window.dispatchEvent(new Event("storage")); // to refresh other components

    navigate("/login"); // redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
