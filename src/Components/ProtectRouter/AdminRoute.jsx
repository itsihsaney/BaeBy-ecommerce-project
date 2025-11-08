import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // 🚫 Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 Logged in but not admin
  if (user.role !== "admin") return <Navigate to="/not-authorized" replace />;

  // ✅ Admin
  return children;
}
