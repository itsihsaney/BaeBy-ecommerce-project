import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useCart } from "../../Context/CartContext";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Get order data and check if came from Payment
  const order = location.state?.order || {};
  const fromPayment = location.state?.fromPayment || false;

  //  Clear cart only if coming from a real payment success
  useEffect(() => {
    if (fromPayment) {
      clearCart();

      // Optional: redirect automatically to orders after few seconds
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fromPayment, clearCart, navigate]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center px-6">
      {/*  Success Icon */}
      <FaCheckCircle className="text-pink-500 text-6xl mb-6 animate-bounce" />

      {/*  Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-600 mb-6">
        Thanks for shopping with{" "}
        <span className="text-pink-500 font-semibold">BaebyStore</span>. <br />
        Your order has been received and is being processed.
      </p>

      {/*  Order Info Card */}
      {order?.id ? (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mb-8 border border-pink-100">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Order Details
          </h2>

          <p className="text-gray-600 text-sm mb-1">
            <strong>Order ID:</strong> #{order.id}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Payment:</strong>{" "}
            {order.method ? order.method.toUpperCase() : "Unknown"}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Status:</strong> {order.status || "Processing"}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Date:</strong> {order.date || new Date().toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="text-gray-400 text-sm mb-8">
          No order details found.
        </div>
      )}

      {/*  Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
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

      {/*  Footer message */}
      <p className="text-gray-400 text-sm mt-10">
        Need help?{" "}
        <Link to="/contact" className="text-pink-500 hover:underline">
          Contact Support
        </Link>
      </p>
    </div>
  );
}

export default OrderSuccess;
