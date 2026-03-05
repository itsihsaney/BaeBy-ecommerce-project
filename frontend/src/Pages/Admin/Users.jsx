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
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch users");
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
      toast.error("Failed to delete user");
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
      toast.error("Failed to update user");
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
      toast.error("Failed to update status");
    }
  };

  /* ================= STATS ================= */

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  /* ================= SEARCH + FILTER ================= */

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

      {/* User Cards */}

      <div className="grid grid-cols-4 gap-6">
        {currentUsers.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 p-5 rounded-xl"
          >
            <h3 className="text-lg font-semibold">
              {user.name}
            </h3>

            <p className="text-gray-400">
              {user.email}
            </p>

            <div className="flex justify-between mt-3">
              <span>{user.role}</span>

              <button
                onClick={() => toggleStatus(user)}
              >
                {user.status}
              </button>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => openEditModal(user)}
              >
                <Edit3 size={16} />
              </button>

              <button
                onClick={() => handleDelete(user)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
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