import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = "http://localhost:5001/users";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 Register user (POST → db.json)
  const register = async (userData) => {
    try {
      // check existing email
      const { data: users } = await axios.get(API_URL);
      const exists = users.some((u) => u.email === userData.email);

      if (exists) {
        return { success: false, message: "Email already registered" };
      }

      // create new user
      const newUser = { id: Date.now(), ...userData };
      await axios.post(API_URL, newUser);

      setUser(newUser);
      return { success: true, message: "Registration successful" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  // 🔹 Login user (GET + filter)
  const login = async (email, password) => {
    try {
      const { data: users } = await axios.get(API_URL);
      const found = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) {
        return { success: false, message: "Invalid email or password" };
      }

      setUser(found);
      return { success: true, user: found };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy access
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
