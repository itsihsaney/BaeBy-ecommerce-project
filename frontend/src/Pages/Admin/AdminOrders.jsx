import React, { useEffect, useState } from "react";
import { PackageCheck, Loader2, XCircle, Edit3 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrders } from "../../api/adminApi";
import api from "../../api/axiosInstance";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const itemsPerPage = 8;

  const [searchParams, setSearchParams] = useSearchParams();
  const filterFromUrl = searchParams.get("filter") || "all";
  const [filter, setFilter] = useState(filterFromUrl);
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    setFilter(searchParams.get("filter") || "all");
  }, [searchParams]);

  /* ─── Fetch Orders ─── */
  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      // Backend: { status: "success", data: [ ...orders ] }
      const data = res.data?.data || [];
      // Sort newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Status Update ─── */
  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    const orderId = editingOrder.id || editingOrder._id;
    try {
      // PATCH /api/admin/orders/:id  { status: "..." }
      await api.patch(`/api/admin/orders/${orderId}`, { status: newStatus });

      setOrders((prev) =>
        prev.map((o) =>
          (o.id || o._id) === orderId ? { ...o, status: newStatus } : o
        )
      );

      toast.success(`Order updated to "${newStatus}"`);
      setEditingOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  /* ─── Filters ─── */
  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status?.toLowerCase().includes(filter.toLowerCase());
  });

  /* ─── Pagination ─── */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ filter, page });
  };

  const handleFilterChange = (type) => {
    setFilter(type);
    setCurrentPage(1);
    if (type === "all") setSearchParams({});
    else setSearchParams({ filter: type, page: 1 });
  };

  return (
    <div className="p-6 bg-[#111827] text-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Orders Management
        </h2>
        <div className="text-sm text-gray-400">
          Total:{" "}
          <span className="text-fuchsia-300 font-semibold">{orders.length}</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "Pending COD", "Paid", "Delivered", "Cancelled"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === type
                ? "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white"
                : "bg-[#1F2937] text-gray-400 border border-fuchsia-800/30 hover:text-fuchsia-300"
              }`}
          >
            {type === "all" ? "All Orders" : type}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-fuchsia-400 w-8 h-8" />
          <span className="ml-3 text-fuchsia-300">Loading...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <PackageCheck size={50} className="text-fuchsia-500 mb-3" />
          <p className="text-lg">No orders found.</p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
        <div className="overflow-x-auto bg-[#1F2937]/80 border border-fuchsia-700/20 rounded-2xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-fuchsia-700/40 to-pink-600/30 text-fuchsia-100 text-sm uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-center">Amount</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order) => {
                const oid = order.id || order._id;
                return (
                  <tr
                    key={oid}
                    className="border-t border-fuchsia-800/20 hover:bg-fuchsia-800/10 transition"
                  >
                    <td className="py-3 px-4 text-xs text-gray-400 font-mono">
                      #{oid?.toString().slice(-6).toUpperCase()}
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-200 font-medium">
                      {order.user?.name || "—"}
                      {order.user?.email && (
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-400">
                      {Array.isArray(order.items)
                        ? `${order.items.length} item${order.items.length !== 1 ? "s" : ""}`
                        : "—"}
                    </td>

                    <td className="py-3 px-4 text-center text-fuchsia-300 font-semibold text-sm">
                      ₹{(order.totalAmount || 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center text-gray-300 capitalize text-sm">
                      {order.paymentMethod?.toUpperCase() || "—"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status?.toLowerCase().includes("delivered")
                            ? "bg-green-500/10 text-green-400"
                            : order.status?.toLowerCase().includes("paid")
                              ? "bg-blue-500/10 text-blue-400"
                              : order.status?.toLowerCase().includes("cancelled")
                                ? "bg-red-500/10 text-red-400"
                                : "bg-orange-500/10 text-orange-400"
                          }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-gray-400 text-xs">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingOrder(order);
                            setNewStatus(order.status || "");
                          }}
                          className="flex items-center gap-1 bg-blue-600/80 hover:bg-blue-500 px-3 py-1 rounded-md text-white text-xs transition"
                        >
                          <Edit3 size={13} /> Edit
                        </button>

                        <button
                          onClick={() => {
                            setEditingOrder(order);
                            setNewStatus("Cancelled");
                          }}
                          className="flex items-center gap-1 bg-rose-600/80 hover:bg-rose-500 px-3 py-1 rounded-md text-white text-xs transition"
                        >
                          <XCircle size={13} /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600 transition"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-2 rounded-lg text-sm transition ${currentPage === i + 1 ? "bg-fuchsia-600 text-white" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E2A] p-6 rounded-2xl border border-fuchsia-700/30 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-fuchsia-300 mb-4">
              Update Order Status
            </h3>
            <p className="text-xs text-gray-500 font-mono mb-4">
              Order #
              {(editingOrder.id || editingOrder._id)?.toString().slice(-6).toUpperCase()}
            </p>

            <label className="block text-sm text-gray-400 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-fuchsia-500 transition mb-4"
            >
              <option value="Pending COD">Pending COD</option>
              <option value="Paid">Paid</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white py-2 rounded-lg hover:opacity-90 transition text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
