import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://6931218d11a8738467cd5cde.mockapi.io/api/v1/orders";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(API_URL);
        // Filter by user's name or email
        const userOrders = data.filter(
          (order) =>
            order.userEmail === user.email ||
            order.userName?.toLowerCase() === user.name?.toLowerCase()
        );

        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <img
          src="/empty.png"
          alt="No Orders"
          className="w-56 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          You haven’t placed any orders yet
        </h2>
        <p className="text-gray-500 mb-6">
          Once you order something, you’ll see it here.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md transition"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Orders
      </h1>

      <div className="grid gap-6">
        {orders.map((order, index) => (
          <div
            key={`${order.id}-${index}`}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition"
          >
            {/* Order header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg text-gray-800">
                Order #{order.id}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status?.includes("Pending")
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order details */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Name:</span> {order.shippingName || order.name}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.address}
              </p>
              <p>
                <span className="font-medium">Date:</span> {order.date}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.method?.toUpperCase()}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phone}
              </p>
            </div>

            {/* Product section */}
            <div className="mt-4 border-t pt-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">
                  {order.product || "—"}
                </p>
                <p className="text-gray-500 text-sm">
                  Price: {order.price || order.totalAmount}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                Total: {order.price || order.totalAmount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
