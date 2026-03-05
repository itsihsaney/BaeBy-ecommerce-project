import React, { useEffect, useState } from "react";
import {
  UserCheck,
  UserX,
  Users as UsersIcon,
  Edit3,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getUsers,
  deleteUser,
  updateUser,
} from "../../api/adminApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });
  const [deleteUserModal, setDeleteUserModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE USER ================= */

  const handleDelete = (user) => {
    setDeleteUserModal(user);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteUserModal.id);

      setUsers((prev) =>
        prev.filter((u) => u.id !== deleteUserModal.id)
      );

      toast.success("User deleted successfully");
      setDeleteUserModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  /* ================= EDIT USER ================= */

  const openEditModal = (user) => {
    setEditingUser(user);

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const closeModal = () => setEditingUser(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateUser(editingUser.id, editForm);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id ? { ...u, ...editForm } : u
        )
      );

      toast.success("User updated successfully");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  /* ================= STATUS TOGGLE ================= */

  const toggleStatus = async (user) => {
    const newStatus =
      user.status === "active" ? "inactive" : "active";

    try {
      await updateUser(user.id, { status: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      toast.success(`User marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  /* ================= STATS ================= */

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  /* ================= SEARCH + FILTER ================= */

  const filteredUsers = (Array.isArray(users) ? users : []).filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

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

  /* ================= PAGINATION ================= */

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-[#111827] min-h-screen text-gray-100">

      {/* Header */}

      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-bold text-fuchsia-400">
          Users Management
        </h2>

        <p>
          Total Users:
          <span className="text-fuchsia-300 ml-2">
            {totalUsers}
          </span>
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Active"
          value={activeUsers}
          icon={<UserCheck />}
        />
        <StatCard
          title="Inactive"
          value={inactiveUsers}
          icon={<UserX />}
        />
      </div>

      {/* Search */}

      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="bg-gray-800 p-2 rounded"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* User Cards or Loader */}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-fuchsia-500/50 transition-colors"
              >
                <h3 className="text-lg font-semibold truncate">
                  {user.name}
                </h3>

                <p className="text-gray-400 text-sm truncate mb-4">
                  {user.email}
                </p>

                <div className="flex items-center justify-between mt-3 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.role}
                  </span>

                  <button
                    onClick={() => toggleStatus(user)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${user.status === 'active' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                  >
                    {user.status}
                  </button>
                </div>

                <div className="flex justify-between mt-auto pt-4 border-t border-gray-700">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                    title="Edit User"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-900/30 rounded-lg"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <UsersIcon size={48} className="mb-4 opacity-20" />
              <p className="text-xl">No users found</p>
              {searchQuery && <p className="text-sm mt-2">Try adjusting your search or filters</p>}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f2937] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
              <Edit3 /> Edit User
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 ">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                  placeholder="User's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                  placeholder="user@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Role</label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-fuchsia-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
              Are you sure you want to delete <span className="font-semibold text-white">{deleteUserModal.name}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteUserModal(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20"
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

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-800 p-5 rounded-xl flex gap-4">
      {icon}
      <div>
        <h3>{title}</h3>
        <p className="text-xl">{value}</p>
      </div>
    </div>
  );
}