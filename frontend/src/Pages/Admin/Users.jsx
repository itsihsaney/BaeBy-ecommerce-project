import React, { useEffect, useState } from "react";
import {
  UserCheck,
  UserX,
  Users as UsersIcon,
  Edit3,
  Trash2,
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
      // Backend: { status: "success", data: [ ...users ] }
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
    // MongoDB toJSON gives us `id` (virtual from _id)
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
      // PATCH /api/admin/users/:id
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
      // PATCH /api/admin/users/:id  { status: "inactive" | "active" }
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
    <div className="p-6 bg-[#111827] min-h-screen text-gray-100">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-fuchsia-400">
          Users Management
        </h2>
        <p className="text-gray-400 text-sm">
          Total:{" "}
          <span className="text-fuchsia-300 font-semibold">{totalUsers}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={totalUsers} icon={<UsersIcon size={22} />} />
        <StatCard title="Active" value={activeUsers} icon={<UserCheck size={22} />} color="text-green-400" />
        <StatCard title="Inactive" value={inactiveUsers} icon={<UserX size={22} />} color="text-red-400" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="bg-[#1F2937] border border-gray-600 px-4 py-2.5 rounded-xl text-gray-200 w-72 focus:outline-none focus:border-fuchsia-500 transition text-sm"
        />
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
          className="bg-[#1F2937] border border-gray-600 px-4 py-2.5 rounded-xl text-gray-200 focus:outline-none focus:border-fuchsia-500 transition text-sm"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* User Cards / Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500" />
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
                    className="bg-[#1F2937] p-5 rounded-xl border border-gray-700 hover:border-fuchsia-500/50 transition-colors flex flex-col"
                  >
                    {/* Avatar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-semibold truncate">{user.name}</h3>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 mb-4">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${user.role === "admin"
                            ? "bg-fuchsia-500/20 text-fuchsia-400"
                            : "bg-blue-500/20 text-blue-400"
                          }`}
                      >
                        {user.role}
                      </span>

                      <button
                        onClick={() => toggleStatus(user)}
                        title={`Click to toggle status`}
                        className={`px-2 py-0.5 text-xs rounded-full transition-all font-medium cursor-pointer ${user.status === "active"
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                      >
                        {user.status || "active"}
                      </button>
                    </div>

                    <div className="flex justify-between mt-auto pt-4 border-t border-gray-700">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-700 rounded-lg"
                        title="Edit User"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteUserModal(user)}
                        className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-900/30 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                <UsersIcon size={48} className="mb-4 opacity-20" />
                <p className="text-xl">No users found</p>
                {searchQuery && (
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600 transition"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${currentPage === i + 1
                      ? "bg-fuchsia-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ── EDIT MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
              <Edit3 size={20} /> Edit User
            </h2>

            <div className="space-y-5">
              <FormField label="Name">
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition"
                  placeholder="User's full name"
                />
              </FormField>

              <FormField label="Email">
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition"
                  placeholder="user@example.com"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Role">
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormField>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg transition font-semibold shadow-lg shadow-fuchsia-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-bold">Delete User</h2>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {deleteUserModal.name}
              </span>
              ? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteUserModal(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition font-semibold shadow-lg shadow-red-500/20"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── helpers ── */
function StatCard({ title, value, icon, color = "text-fuchsia-400" }) {
  return (
    <div className="bg-[#1F2937] p-5 rounded-xl flex items-center gap-4 border border-gray-700">
      <div className={`${color} opacity-80`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}