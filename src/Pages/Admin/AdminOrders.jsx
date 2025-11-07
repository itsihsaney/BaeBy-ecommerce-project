import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      <table className="w-full border-collapse bg-white rounded-xl shadow-md overflow-hidden">
        <thead>
          <tr className="bg-yellow-100">
            <th className="py-3 px-4 border">ID</th>
            <th className="py-3 px-4 border">Customer</th>
            <th className="py-3 px-4 border">Product</th>
            <th className="py-3 px-4 border">Amount</th>
            <th className="py-3 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center hover:bg-gray-100">
              <td className="py-2 px-4 border">{order.id}</td>
              <td className="py-2 px-4 border">{order.name}</td>
              <td className="py-2 px-4 border">{order.product || "—"}</td>
              <td className="py-2 px-4 border">₹{order.price || order.totalAmount}</td>
              <td
                className={`py-2 px-4 border font-semibold ${
                  order.status.includes("Pending")
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

