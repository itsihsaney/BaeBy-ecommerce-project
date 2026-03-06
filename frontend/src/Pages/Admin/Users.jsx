import React, { useEffect, useState } from "react";
import { UserCheck, UserX, Users as UsersIcon, Edit2, Trash2, Search, Filter, Shield, User as SingleUser } from "lucide-react";
import toast from "react-hot-toast";
import { getUsers, deleteUser, updateUser } from "../../api/adminApi";
import DataTable from "../../Components/admin/DataTable";
import Badge from "../../Components/admin/Badge";
import Modal from "../../Components/admin/Modal";
import StatCard from "../../Components/admin/StatCard";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", role: "", status: "" });
    const [deleteUserModal, setDeleteUserModal] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchUsers = async () => {
        setLoading(true);
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

    useEffect(() => { fetchUsers(); }, []);

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

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditForm({ name: user.name || "", email: user.email || "", role: user.role || "user", status: user.status || "active" });
    };

    const handleEditChange = (e) => setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSaveChanges = async () => {
        const userId = editingUser.id || editingUser._id;
        try {
            await updateUser(userId, editForm);
            setUsers((prev) => prev.map((u) => (u.id || u._id) === userId ? { ...u, ...editForm } : u));
            toast.success("User updated successfully");
            setEditingUser(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update user");
        }
    };

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const inactiveUsers = users.filter((u) => u.status === "inactive").length;

    const filteredUsers = users.filter((u) => {
        const q = searchQuery.toLowerCase();
        const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
        const matchFilter = filter === "all" ? true
            : filter === "active" ? u.status === "active"
                : filter === "inactive" ? u.status === "inactive"
                    : filter === "admin" ? u.role === "admin"
                        : u.role === "user";
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-1">User Management</h1>
                <p className="text-gray-400 font-medium">Manage platform accounts and roles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={totalUsers} icon={UsersIcon} color="blue" />
                <StatCard title="Active Users" value={activeUsers} icon={UserCheck} color="emerald" />
                <StatCard title="Inactive Users" value={inactiveUsers} icon={UserX} color="rose" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-[#111111]/80 backdrop-blur-3xl p-4 rounded-3xl border border-white/[0.05] shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/[0.02] border border-white/[0.05] pl-12 pr-4 py-3 rounded-2xl text-gray-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm placeholder:text-gray-600"
                    />
                </div>
                <div className="relative md:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <select
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white/[0.02] border border-white/[0.05] pl-12 pr-4 py-3 rounded-2xl text-gray-200 focus:outline-none focus:border-purple-500/50 transition-all text-sm appearance-none"
                    >
                        <option value="all" className="bg-[#111111]">All Users</option>
                        <option value="active" className="bg-[#111111]">Active</option>
                        <option value="inactive" className="bg-[#111111]">Inactive</option>
                        <option value="admin" className="bg-[#111111]">Admins</option>
                        <option value="user" className="bg-[#111111]">Regular Users</option>
                    </select>
                </div>
            </div>

            <DataTable
                isLoading={loading}
                emptyMessage="No users found matching your search."
                headers={[
                    { label: "Avatar" }, { label: "Name" }, { label: "Email" },
                    { label: "Role" }, { label: "Status" }, { label: "Actions", align: "right" }
                ]}
            >
                {currentUsers.map(user => {
                    const uid = user.id || user._id;
                    return (
                        <tr key={uid} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 pr-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/20">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </td>
                            <td className="py-4 pr-4 font-bold text-gray-200 text-sm">{user.name}</td>
                            <td className="py-4 pr-4 text-gray-400 text-sm">{user.email}</td>
                            <td className="py-4 pr-4">
                                <Badge type={user.role === "admin" ? "admin" : "user"}>
                                    <span className="flex items-center gap-1">
                                        {user.role === "admin" ? <Shield size={11} /> : <SingleUser size={11} />} {user.role}
                                    </span>
                                </Badge>
                            </td>
                            <td className="py-4 pr-4">
                                <Badge type={user.status || "active"}>{user.status || "active"}</Badge>
                            </td>
                            <td className="py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => openEditModal(user)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors" title="Edit User">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => setDeleteUserModal(user)} className="p-2 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors" title="Delete User">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </DataTable>

            {totalPages > 1 && !loading && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-[#111111] rounded-xl text-sm disabled:opacity-50 text-white font-medium border border-white/5">Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors flex items-center justify-center ${currentPage === i + 1 ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]" : "bg-[#111111] text-gray-400 hover:bg-white/10 border border-white/5"}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-[#111111] rounded-xl text-sm disabled:opacity-50 text-white font-medium border border-white/5">Next</button>
                </div>
            )}

            <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit User" icon={Edit2}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
                        <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Email</label>
                        <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Role</label>
                            <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 text-sm appearance-none">
                                <option value="user" className="bg-[#111111]">Regular User</option>
                                <option value="admin" className="bg-[#111111]">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Status</label>
                            <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 text-sm appearance-none">
                                <option value="active" className="bg-[#111111]">Active</option>
                                <option value="inactive" className="bg-[#111111]">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/5 mt-4">
                        <button onClick={() => setEditingUser(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl font-medium text-sm transition-all">Cancel</button>
                        <button onClick={handleSaveChanges} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">Save Changes</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!deleteUserModal} onClose={() => setDeleteUserModal(null)} title="Delete User" icon={Trash2}>
                <p className="text-gray-400 text-sm mb-6">Are you sure you want to permanently delete <span className="text-white font-bold">{deleteUserModal?.name}</span>? This cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteUserModal(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl font-medium text-sm">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(244,63,94,0.3)]">Delete Account</button>
                </div>
            </Modal>
        </div>
    );
}
