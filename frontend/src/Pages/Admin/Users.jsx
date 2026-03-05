import React, { useEffect, useState } from "react";
import {
  UserCheck,
  UserX,
  Users as UsersIcon,
  Edit2,
  Trash2,
  Search,
  Filter,
  Shield,
  User as SingleUser
} from "lucide-react";
import toast from "react-hot-toast";
import { getUsers, deleteUser, updateUser } from "../../api/adminApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", status: "" });
  const [deleteUserModal, setDeleteUserModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  /* ───── FETCH ───── */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ───── DELETE ───── */
  const confirmDelete = async () => {
    const userId = deleteUserModal.id || deleteUserModal._id;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
      toast.success("User deleted successfully");
      setDeleteUserModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  /* ───── EDIT ───── */
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      status: user.status || "active",
    });
  };

  const closeModal = () => setEditingUser(null);

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    const userId = editingUser.id || editingUser._id;
    try {
      await updateUser(userId, editForm);
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === userId ? { ...u, ...editForm } : u
        )
      );
      toast.success("User updated successfully");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  /* ───── STATUS TOGGLE ───── */
  const toggleStatus = async (user) => {
    const userId = user.id || user._id;
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateUser(userId, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === userId ? { ...u, status: newStatus } : u
        )
      );
      toast.success(`User marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle status");
    }
  };

  /* ───── DERIVED STATS ───── */
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  /* ───── FILTER + SEARCH ───── */
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);

    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? u.status === "active"
          : filter === "inactive"
            ? u.status === "inactive"
            : filter === "admin"
              ? u.role === "admin"
              : u.role === "user";

    return matchSearch && matchFilter;
  });

  /* ───── PAGINATION ───── */
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ───── UI ───── */
  return (
    <div className="p-2 md:p-6 pb-20 text-gray-100">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            User Management
          </h1>
          <p className="text-gray-400">View, edit, and manage platform users.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Users" value={totalUsers} icon={UsersIcon} color="blue" />
        <StatCard title="Active Users" value={activeUsers} icon={UserCheck} color="emerald" />
        <StatCard title="Inactive Users" value={inactiveUsers} icon={UserX} color="rose" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#0f0f11] p-4 rounded-3xl border border-white/[0.05] shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white/[0.02] border border-white/[0.05] pl-12 pr-4 py-3 rounded-2xl text-gray-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm placeholder-gray-600"
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white/[0.02] border border-white/[0.05] pl-12 pr-4 py-3 rounded-2xl text-gray-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#0f0f11]">All Users</option>
            <option value="active" className="bg-[#0f0f11]">Active Status</option>
            <option value="inactive" className="bg-[#0f0f11]">Inactive Status</option>
            <option value="admin" className="bg-[#0f0f11]">Administrators</option>
            <option value="user" className="bg-[#0f0f11]">Regular Users</option>
          </select>
        </div>
      </div>

      {/* User Cards / Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => {
                const uid = user.id || user._id;
                return (
                  <div
                    key={uid}
                    className="bg-[#0f0f11] rounded-3xl border border-white/[0.05] p-6 hover:border-violet-500/30 transition-all duration-300 shadow-xl hover:shadow-violet-500/10 flex flex-col group relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors"></div>

                    {/* Avatar */}
                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600/20 to-indigo-600/20 text-violet-400 flex items-center justify-center text-lg font-bold border border-violet-500/20">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-base font-bold text-white truncate">{user.name}</h3>
                          <p className="text-gray-500 text-xs truncate max-w-[12rem]">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6 relative z-10">
                      <span className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-semibold border ${user.role === "admin"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                        {user.role === "admin" ? <Shield size={12} /> : <SingleUser size={12} />}
                        {user.role}
                      </span>

                      <button
                        onClick={() => toggleStatus(user)}
                        title={`Click to toggle status`}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-semibold border transition-all cursor-pointer hover:opacity-80 ${user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                        {user.status || "active"}
                      </button>
                    </div>

                    <div className="flex gap-2 mt-auto pt-4 border-t border-white/[0.05] relative z-10">
                      <button
                        onClick={() => openEditModal(user)}
                        className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] py-2 rounded-xl transition-all text-sm font-medium border border-transparent hover:border-white/[0.05]"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteUserModal(user)}
                        className="flex items-center justify-center text-rose-400 hover:text-white bg-rose-500/5 hover:bg-rose-500 p-2 w-10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 bg-[#0f0f11] rounded-3xl border border-white/[0.05]">
                <UsersIcon size={48} className="mb-4 text-gray-700" />
                <p className="text-xl font-medium text-gray-400">No users found</p>
                {searchQuery && (
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#0f0f11] border border-white/[0.05] rounded-xl text-sm disabled:opacity-30 hover:bg-white/[0.05] transition-all font-medium"
              >
                Previous
              </button>
              <div className="flex gap-1.5 px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#0f0f11] border border-white/[0.05] rounded-xl text-sm disabled:opacity-30 hover:bg-white/[0.05] transition-all font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ── EDIT MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-[#0f0f11] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/20">
                <Edit2 size={18} />
              </div>
              Edit User Profile
            </h2>

            <div className="space-y-5">
              <FormField label="Full Name">
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm placeholder-gray-600"
                  placeholder="User's full name"
                />
              </FormField>

              <FormField label="Email Address">
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm placeholder-gray-600"
                  placeholder="user@example.com"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Access Role">
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="user" className="bg-[#0f0f11]">Regular User</option>
                    <option value="admin" className="bg-[#0f0f11]">Administrator</option>
                  </select>
                </FormField>

                <FormField label="Account Status">
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="active" className="bg-[#0f0f11]">Active</option>
                    <option value="inactive" className="bg-[#0f0f11]">Inactive</option>
                  </select>
                </FormField>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={closeModal}
                className="flex-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white py-3 rounded-xl transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-[#0f0f11] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={24} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Delete User Account</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">{deleteUserModal.name}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteUserModal(null)}
                className="flex-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white py-3 rounded-xl transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── helpers ── */
function StatCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-600/5 text-blue-500 border-blue-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-500 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-600/5 text-rose-500 border-rose-500/20",
  };

  const bgStyle = colorMap[color];

  return (
    <div className="bg-[#0f0f11] p-6 rounded-3xl flex items-center gap-5 border border-white/[0.05] shadow-xl relative overflow-hidden">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${bgStyle} blur-2xl opacity-40`}></div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${bgStyle} relative z-10`}>
        <Icon size={24} />
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}