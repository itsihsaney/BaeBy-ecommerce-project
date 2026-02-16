import React from "react";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-pink-600 mb-3">Access Denied</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        You don’t have permission to access this page. Please login as an admin
        or go back to the home page.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-pink-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 transition"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
