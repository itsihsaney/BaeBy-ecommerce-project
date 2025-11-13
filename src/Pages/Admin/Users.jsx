import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCheck,
  UserX,
  Users as UsersIcon,
  Edit3,
  Trash2,
  Loader2,
  Search,
  Filter,
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", status: "" });

  //  Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/users");
      setUsers(res.data);
    } catch (err) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  //  Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5001/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete user", "error");
    }
  };

  //  Edit user modal setup
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const closeModal = () => {
    setEditingUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(`http://localhost:5001/users/${editingUser.id}`, editForm);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...editForm } : u))
      );
      showToast("User details updated successfully", "success");
      closeModal();
    } catch (err) {
      showToast("Failed to save changes", "error");
    }
  };

  //  Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  //  Filter + Search
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? u.status === "active"
        : filter === "inactive"
        ? u.status === "inactive"
        : filter === "admin"
        ? u.role === "admin"
        : u.role === "user";

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-[#111827] min-h-screen text-gray-100 relative">
      {/*  Toast */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Users Management
        </h2>
        <p className="text-sm text-gray-400 mt-2 sm:mt-0">
          Total Users:{" "}
          <span className="text-fuchsia-300 font-semibold">{totalUsers}</span>
        </p>
      </div>

      {/*  Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={totalUsers} icon={<UsersIcon />} color="from-fuchsia-600 to-pink-500" />
        <StatCard title="Active" value={activeUsers} icon={<UserCheck />} color="from-green-600 to-emerald-500" />
        <StatCard title="Inactive" value={inactiveUsers} icon={<UserX />} color="from-rose-600 to-pink-500" />
      </div>

      {/*  Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1F2937] text-gray-200 border border-fuchsia-700/30 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          />
        </div>

        <div className="relative">
          <Filter size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1F2937] border border-fuchsia-700/30 text-gray-200 pl-10 pr-6 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* User Cards */}
      {!loading && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-[#1F2937]/80 border border-fuchsia-700/20 rounded-2xl p-5 shadow-lg hover:shadow-fuchsia-600/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.role === "admin"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-fuchsia-500/20 text-fuchsia-300"
                  }`}>{user.role}</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}>{user.status}</span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => openEditModal(user)}
                  className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-fuchsia-500 px-3 py-1.5 rounded-md text-white text-xs font-medium hover:opacity-90 transition"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center gap-1 bg-gradient-to-r from-rose-600 to-pink-500 px-3 py-1.5 rounded-md text-white text-xs font-medium hover:opacity-90 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] p-6 rounded-2xl shadow-lg border border-fuchsia-700/30 w-96 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-fuchsia-400 transition">✖</button>
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">Edit User</h3>

            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:ring-fuchsia-500"
                placeholder="Name"
              />
              <input
                type="email"
                name="email" 
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:ring-fuchsia-500"
                placeholder="Email"
                
              />
              <select
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={handleSaveChanges}
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

// Helper component for stat cards
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-5 rounded-xl flex items-center gap-4 shadow-md`}>
      <div className="text-white">{icon}</div>
      <div>
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-white/80 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
