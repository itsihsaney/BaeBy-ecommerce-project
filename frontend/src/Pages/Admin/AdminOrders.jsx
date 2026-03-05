import React, { useEffect, useState } from "react";
import { PackageCheck, Loader2, XCircle, Edit2, ShieldAlert } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrders } from "../../api/adminApi";
import api from "../../api/axiosInstance";
import { convertToINR } from "../../utils/currency";

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
      const data = res.data?.data || [];
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
    <div className="p-2 md:p-6 pb-20 text-gray-100 relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Order Management
          </h1>
          <p className="text-gray-400">Track and update customer orders.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0f0f11] px-4 py-2 border border-white/[0.05] rounded-2xl shadow-xl">
          <span className="text-sm text-gray-400 font-medium">Total Volume:</span>
          <span className="text-lg text-violet-400 font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-8 bg-[#0f0f11] p-3 rounded-3xl border border-white/[0.05] shadow-lg overflow-x-auto hide-scrollbar">
        {["all", "Pending COD", "Paid", "Delivered", "Cancelled"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold capitalize transition-all whitespace-nowrap ${filter === type
              ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-transparent"
              : "bg-white/[0.02] text-gray-400 border border-white/5 hover:bg-white/[0.05] hover:text-white"
              }`}
          >
            {type === "all" ? "All Orders" : type}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-[#0f0f11] rounded-3xl border border-white/[0.05] mt-6">
          <PackageCheck size={50} className="mb-4 text-gray-700" />
          <p className="text-xl font-medium text-gray-400">No orders found.</p>
          <p className="text-sm mt-2 text-gray-500">Select another filter or check back later.</p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
        <div className="bg-[#0f0f11] rounded-3xl p-6 border border-white border-opacity-[0.05] shadow-2xl relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-white/10 uppercase tracking-wider">
                  <th className="pb-4 pr-4 font-semibold">Order ID</th>
                  <th className="pb-4 pr-4 font-semibold">Customer</th>
                  <th className="pb-4 pr-4 font-semibold">Items</th>
                  <th className="pb-4 text-center font-semibold">Amount</th>
                  <th className="pb-4 text-center font-semibold">Payment</th>
                  <th className="pb-4 text-center font-semibold">Status</th>
                  <th className="pb-4 text-center font-semibold">Date</th>
                  <th className="pb-4 text-right pr-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order) => {
                  const oid = order.id || order._id;
                  return (
                    <tr
                      key={oid}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-5 pr-4 text-xs font-mono text-gray-400 group-hover:text-violet-400 transition-colors">
                        #{oid?.toString().slice(-8).toUpperCase()}
                      </td>

                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-bold border border-violet-500/20">
                            {(order.user?.name || "G").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-gray-200 font-bold tracking-tight">
                              {order.user?.name || "Guest"}
                            </p>
                            {order.user?.email && (
                              <p className="text-xs text-gray-500 font-medium">
                                {order.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-5 pr-4 text-sm text-gray-400 font-medium">
                        {Array.isArray(order.items)
                          ? <span className="bg-white/5 px-2 py-1 rounded-lg border border-white/5">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                          : "—"}
                      </td>

                      <td className="py-5 text-center font-bold text-gray-200 text-sm">
                        {convertToINR(order.totalAmount || 0)}
                      </td>

                      <td className="py-5 text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          {order.paymentMethod || "—"}
                        </span>
                      </td>

                      <td className="py-5 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold capitalize border ${order.status?.toLowerCase().includes("delivered")
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : order.status?.toLowerCase().includes("paid")
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : order.status?.toLowerCase().includes("cancelled")
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-5 text-center text-gray-400 text-xs font-medium">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </td>

                      <td className="py-5 text-right pr-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingOrder(order);
                              setNewStatus(order.status || "");
                            }}
                            className="flex justify-center items-center w-8 h-8 bg-white/[0.02] hover:bg-white/[0.08] border border-transparent hover:border-white/10 rounded-xl text-gray-300 hover:text-white transition-all shadow-sm"
                            title="Edit Order Status"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingOrder(order);
                              setNewStatus("Cancelled");
                            }}
                            className="flex justify-center items-center w-8 h-8 bg-rose-500/5 hover:bg-rose-500 border border-transparent hover:border-rose-500/20 rounded-xl text-rose-400 hover:text-white transition-all shadow-sm"
                            title="Cancel Order"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#0f0f11] border border-white/[0.05] rounded-xl text-sm disabled:opacity-30 hover:bg-white/[0.05] transition-all font-medium"
          >
            Previous
          </button>
          <div className="flex gap-1.5 px-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm transition font-medium flex items-center justify-center ${currentPage === i + 1
                  ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  : "bg-[#0f0f11] border border-white/[0.05] text-gray-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#0f0f11] border border-white/[0.05] rounded-xl text-sm disabled:opacity-30 hover:bg-white/[0.05] transition-all font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-[#0f0f11] p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-sm relative">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/20">
                <ShieldAlert size={18} />
              </div>
              Update Status
            </h3>
            <p className="text-sm text-gray-500 font-mono mb-6 bg-white/5 inline-block px-3 py-1 rounded-lg border border-white/5">
              Order #
              {(editingOrder.id || editingOrder._id)?.toString().slice(-8).toUpperCase()}
            </p>

            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Select New Status
            </label>
            <div className="relative mb-8">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="Pending COD" className="bg-[#0f0f11]">Pending COD</option>
                <option value="Paid" className="bg-[#0f0f11]">Paid</option>
                <option value="Delivered" className="bg-[#0f0f11]">Delivered</option>
                <option value="Cancelled" className="bg-[#0f0f11]">Cancelled</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white py-3 rounded-xl transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
