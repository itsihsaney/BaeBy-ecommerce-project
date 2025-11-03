import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order || {};

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center px-6">
      {/* Success Icon */}
      <FaCheckCircle className="text-pink-500 text-6xl mb-6 animate-bounce" />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600 mb-6">
        Thanks for shopping with <span className="text-pink-500 font-semibold">BaebyStore</span>  
        Your order has been received and is being processed.
      </p>

      {/* Order Info Card */}
      {order?.id && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Order Details</h2>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Order ID:</strong> #{order.id}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Payment:</strong> {order.method.toUpperCase()}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Date:</strong> {order.date}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/products"
          className="bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="bg-white border border-pink-400 text-pink-500 px-6 py-3 rounded-full font-medium hover:bg-pink-50 transition"
        >
          View My Orders
        </Link>
      </div>

      {/* Footer message */}
      <p className="text-gray-400 text-sm mt-10">
        Need help? <Link to="/contact" className="text-pink-500 hover:underline">Contact Support</Link>
      </p>
    </div>
  );
}

export default OrderSuccess;
