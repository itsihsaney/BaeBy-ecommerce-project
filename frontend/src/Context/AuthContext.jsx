import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const API_URL = "http://localhost:5001/api/auth";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      return JSON.parse(savedUser);
    }
    return null;
  });

  // Register
  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, userData);
      return { success: true, message: data.message };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data?.errors?.[0] || "Registration failed"
      };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });

      const { token, user: userData } = data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      // Set default axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, user: userData };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || err.response?.data?.errors?.[0] || "Login failed"
      };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    delete axios.defaults.headers.common["Authorization"];

    if (clearCart) clearCart();
    if (clearWishlist) clearWishlist();

    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
