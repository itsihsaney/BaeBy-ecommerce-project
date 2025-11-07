import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Trash2, CheckCircle, XCircle, X, Plus } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", status: "active" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Fetch users from db.json
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5001/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  // Toggle status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.patch(`http://localhost:5001/users/${id}`, { status: updatedStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: updatedStatus } : u))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5001/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setIsAdding(false);
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  // Open add modal
  const openAddModal = () => {
    setEditingUser(null);
    setIsAdding(true);
    setFormData({ name: "", email: "", role: "user", status: "active" });
  };

  // Close modal
  const closeModal = () => {
    setEditingUser(null);
    setIsAdding(false);
  };

  // Handle form update
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save (Add or Edit)
  const handleSave = async () => {
    try {
      if (isAdding) {
        const newUser = { id: Date.now().toString(), ...formData };
        await axios.post("http://localhost:5001/users", newUser);
        setUsers((prev) => [...prev, newUser]);
      } else {
        await axios.patch(`http://localhost:5001/users/${editingUser.id}`, formData);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, ...formData } : u
          )
        );
      }
      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  if (loading)
    return <p className="text-fuchsia-400 text-lg p-6 font-medium">Loading users...</p>;

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  return (
    <div className="sticky top-0 z-40 bg-[#111827]/90 backdrop-blur-md border-b border-fuchsia-700/20 shadow-md p-4 rounded-b-lg mb-8">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">Manage all user accounts, roles & activity</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1F2937] border border-fuchsia-700/30 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-gray-100 placeholder-gray-400"
          />
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 shadow-md transition"
          >
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={totalUsers} color="from-fuchsia-600 to-pink-500" />
        <StatCard title="Active" value={activeUsers} color="from-green-600 to-emerald-500" />
        <StatCard title="Inactive" value={inactiveUsers} color="from-gray-600 to-gray-400" />
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-[#1F2937]/80 backdrop-blur-md border border-fuchsia-700/20 rounded-2xl shadow-md p-5 hover:shadow-fuchsia-600/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-1 text-white">{user.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{user.email}</p>

              {/* Role Badge */}
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  user.role === "admin"
                    ? "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white"
                    : "bg-[#374151] text-gray-300"
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>

              {/* Status Toggle */}
              <div
                onClick={() => handleToggleStatus(user.id, user.status)}
                className="mt-4 flex items-center gap-2 cursor-pointer select-none"
              >
                {user.status === "active" ? (
                  <span className="flex items-center gap-2 text-green-400 font-medium text-sm">
                    <CheckCircle size={18} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                    <XCircle size={18} /> Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-5">
              <button
                onClick={() => openEditModal(user)}
                className="flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 transition"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(editingUser || isAdding) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] p-6 rounded-2xl shadow-lg border border-fuchsia-700/30 w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-fuchsia-400 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              {isAdding ? "Add New User" : "Edit User"}
            </h3>

            <div className="space-y-4">
              <InputField label="Name" name="name" value={formData.name} onChange={handleFormChange} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleFormChange} />

              <SelectField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                options={[
                  { label: "User", value: "user" },
                  { label: "Admin", value: "admin" },
                ]}
              />

              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Blocked", value: "block" },
                ]}
              />

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:opacity-90 transition"
              >
                {isAdding ? "Add User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🧩 Reusable Input Component */
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
    />
  </div>
);

/* 🧩 Reusable Select Component */
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* 💠 Stat Card */
function StatCard({ title, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-4 rounded-xl text-white shadow-md`}>
      <h4 className="text-sm opacity-90">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
