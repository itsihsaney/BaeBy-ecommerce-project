import React from "react";
import { Navigate } from "react-router-dom";

/**
 * AdminRoute Protector
 *
 * Strategy: Check for `adminToken` in localStorage (set by AdminLogin).
 * This is decoupled from AuthContext so normal user sessions are not affected.
 */
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
