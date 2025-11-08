import React, { useEffect, useState } from "react";
import axios from "axios";
import { PackageCheck, Loader2, XCircle, Edit3 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [filter, setFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5001/orders");
      setOrders(res.data);
    } catch (err) {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  // 🟢 Update status via modal
  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await axios.patch(`http://localhost:5001/orders/${editingOrder.id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...o, status: newStatus } : o
        )
      );
      showToast(`Order #${editingOrder.id} updated to ${newStatus}`, "success");
      setEditingOrder(null);
    } catch (err) {
      showToast("Failed to update order", "error");
    }
  };

  // 🔴 Cancel order
  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`http://localhost:5001/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast("Order canceled successfully", "success");
    } catch (err) {
      showToast("Failed to cancel order", "error");
    }
  };

  // ✅ Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status?.toLowerCase().includes(filter);
  });

  return (
    <div className="p-6 bg-[#111827] text-gray-100 min-h-screen relative">
      {/* ===== Toast ===== */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-600/90 text-white"
              : "bg-rose-600/90 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Orders Management
        </h2>
        <div className="text-sm text-gray-400">
          Total Orders:{" "}
          <span className="text-fuchsia-300 font-semibold">
            {orders.length}
          </span>
        </div>
      </div>

      {/* ===== Filter Buttons ===== */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "pending", "paid", "delivered"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filter === type
                ? "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-md"
                : "bg-[#1F2937] text-gray-400 border border-fuchsia-800/30 hover:text-fuchsia-300"
            }`}
          >
            {type === "all" ? "All Orders" : type}
          </button>
        ))}
      </div>

      {/* ===== Loading ===== */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-fuchsia-400 w-8 h-8" />
          <span className="ml-3 text-fuchsia-300 text-lg">Loading Orders...</span>
        </div>
      )}

      {/* ===== Empty ===== */}
      {!loading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <PackageCheck size={50} className="text-fuchsia-500 mb-3" />
          <p className="text-lg">No orders found for this filter.</p>
        </div>
      )}

      {/* ===== Table ===== */}
      {!loading && filteredOrders.length > 0 && (
        <div className="overflow-x-auto bg-[#1F2937]/80 backdrop-blur-md border border-fuchsia-700/20 rounded-2xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-fuchsia-700/40 to-pink-600/30 text-fuchsia-100 text-sm uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-center">Amount ($)</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Date & Time</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-fuchsia-800/20 hover:bg-fuchsia-800/10 transition-all duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-300">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-200 font-medium">
                    {order.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {order.product || "—"}
                  </td>
                  <td className="py-3 px-4 text-center text-fuchsia-300 font-semibold">
                    ${order.price || order.totalAmount}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-300 capitalize">
                    {order.method || order.paymentMethod || "—"}
                  </td>

                  <td
                    className={`py-3 px-4 text-center font-semibold ${
                      order.status?.includes("Pending")
                        ? "text-orange-400"
                        : order.status?.includes("Paid")
                        ? "text-blue-400"
                        : order.status?.includes("Delivered")
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {order.status}
                  </td>

                  <td className="py-3 px-4 text-center text-gray-400 text-xs">
                    {order.date}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingOrder(order);
                        setNewStatus(order.status);
                      }}
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-fuchsia-500 px-3 py-1 rounded-md text-white text-xs font-medium hover:opacity-90 shadow-md transition"
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center gap-1 bg-gradient-to-r from-rose-600 to-pink-500 px-3 py-1 rounded-md text-white text-xs font-medium hover:opacity-90 shadow-md transition"
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] p-6 rounded-2xl shadow-lg border border-fuchsia-700/30 w-96 relative">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-fuchsia-400 transition"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              Edit Order #{editingOrder.id}
            </h3>

            <div className="space-y-4">
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Delivered">Delivered</option>
              </select>

              <button
                onClick={handleUpdateStatus}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
