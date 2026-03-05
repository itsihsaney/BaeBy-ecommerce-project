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

  // ─── URL params ────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const filterFromUrl = searchParams.get("filter") || "all";
  const [filter, setFilter] = useState(filterFromUrl);
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  // ───────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sync filter from URL changes
  useEffect(() => {
    setFilter(searchParams.get("filter") || "all");
  }, [searchParams]);

  /* ─── Fetch all orders from real backend ─── */
  const fetchOrders = async () => {
    try {
      // getOrders() → GET /api/admin/orders  (JWT auto-attached via axiosInstance)
      const res = await getOrders();
      // Backend: { status: "success", data: [...] }
      const data = res.data?.data || [];
      // Sort newest first using createdAt
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─── Status update ─── */
  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      // PATCH /api/admin/orders/:id  — update status field only
      await api.patch(`/api/admin/orders/${editingOrder.id}`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...o, status: newStatus } : o
        )
      );

      toast.success(`Order updated to "${newStatus}"`);
      setEditingOrder(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update order status"
      );
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
    <div className="p-6 bg-[#111827] text-gray-100 min-h-screen relative">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Orders Management
        </h2>
        <div className="text-sm text-gray-400">
          Total Orders:{" "}
          <span className="text-fuchsia-300 font-semibold">{orders.length}</span>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "pending", "paid", "delivered"].map((type) => (
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

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-fuchsia-400 w-8 h-8" />
          <span className="ml-3 text-fuchsia-300 text-lg">Loading...</span>
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <PackageCheck size={50} className="text-fuchsia-500 mb-3" />
          <p className="text-lg">No orders found.</p>
        </div>
      )}

      {/* ORDERS TABLE */}
      {!loading && filteredOrders.length > 0 && (
        <div className="overflow-x-auto bg-[#1F2937]/80 border border-fuchsia-700/20 rounded-2xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-fuchsia-700/40 to-pink-600/30 text-fuchsia-100 text-sm uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-center">Amount ($)</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order) => (
                <tr
                  key={order.id || order._id}
                  className="border-t border-fuchsia-800/20 hover:bg-fuchsia-800/10 transition"
                >
                  <td className="py-3 px-4 text-xs text-gray-400 font-mono">
                    #{(order.id || order._id)?.toString().slice(-6).toUpperCase()}
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-200 font-medium">
                    {order.user?.name || "—"}
                    {order.user?.email && (
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    )}
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-400">
                    {Array.isArray(order.items)
                      ? `${order.items.length} item${order.items.length !== 1 ? "s" : ""}`
                      : "—"}
                  </td>

                  <td className="py-3 px-4 text-center text-fuchsia-300 font-semibold">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-center text-gray-300 capitalize text-sm">
                    {order.paymentMethod?.toUpperCase() || "—"}
                  </td>

                  <td
                    className={`py-3 px-4 text-center font-semibold text-sm ${order.status?.toLowerCase().includes("pending")
                        ? "text-orange-400"
                        : order.status?.toLowerCase().includes("paid")
                          ? "text-blue-400"
                          : order.status?.toLowerCase().includes("delivered")
                            ? "text-green-400"
                            : "text-gray-400"
                      }`}
                  >
                    {order.status || "—"}
                  </td>

                  <td className="py-3 px-4 text-center text-gray-400 text-xs">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setNewStatus(order.status || "");
                        }}
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-fuchsia-500 px-3 py-1 rounded-md text-white text-xs font-medium hover:opacity-90"
                      >
                        <Edit3 size={14} /> Edit
                      </button>

                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setNewStatus("Cancelled");
                        }}
                        className="flex items-center gap-1 bg-gradient-to-r from-rose-600 to-pink-500 px-3 py-1 rounded-md text-white text-xs font-medium hover:opacity-90"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && filteredOrders.length > 0 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-30"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-2 rounded-lg ${currentPage === i + 1 ? "bg-fuchsia-600" : "bg-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      {/* EDIT / STATUS MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] p-6 rounded-2xl border border-fuchsia-700/30 w-96 relative">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-fuchsia-400"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold text-fuchsia-300 mb-4">
              Edit Order #{(editingOrder.id || editingOrder._id)?.toString().slice(-6).toUpperCase()}
            </h3>

            <div className="space-y-4">
              <label className="block text-sm text-gray-400">Status</label>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-fuchsia-500"
              >
                <option value="Pending COD">Pending COD</option>
                <option value="Paid">Paid</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={handleUpdateStatus}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white mt-4 py-2 rounded-lg hover:opacity-90 transition"
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
