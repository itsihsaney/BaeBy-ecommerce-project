import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock, ShoppingBag, User as UserIcon, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getNotifications, markNotificationAsRead, markAllNotificationsRead } from '../../api/adminApi';
import DataTable from '../../Components/admin/DataTable';
import Badge from '../../Components/admin/Badge';
import { motion } from 'framer-motion';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotifications();
            setNotifications(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id, orderId) => {
        try {
            await markNotificationAsRead(id);
            if (orderId) {
                navigate(`/admin/orders`); // Ideally we'd go to specific order, but our Orders page is frontend filtered. For now go to orders.
            } else {
                fetchNotifications();
            }
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            toast.success("All notifications marked as read");
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 border border-white/5 transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className="text-3xl font-black text-white tracking-tight">Notifications</h1>
                    </div>
                    <p className="text-gray-400 font-medium">Stay updated with the latest activity on your platform.</p>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    disabled={notifications.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold border border-white/10 transition-all text-sm group"
                >
                    <CheckCheck size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                    Mark all as read
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing updates...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-[#111111]/50 border border-white/5 rounded-[32px] p-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 text-gray-600">
                            <Bell size={40} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Workspace is Quiet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">You're all caught up! No new notifications at the moment.</p>
                    </div>
                ) : (
                    notifications.map((notif, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={notif._id}
                            onClick={() => handleMarkAsRead(notif._id, notif.orderId)}
                            className={`group relative flex items-center gap-4 p-5 rounded-[24px] border transition-all cursor-pointer ${!notif.isRead
                                    ? "bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10"
                                    : "bg-[#111111]/40 border-white/5 hover:bg-white/5"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110 ${notif.type === 'order'
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                }`}>
                                {notif.type === 'order' ? <ShoppingBag size={20} /> : <UserIcon size={20} />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                    <p className={`text-sm font-bold truncate ${!notif.isRead ? "text-white" : "text-gray-300"}`}>
                                        {notif.message}
                                    </p>
                                    {!notif.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {getTimeAgo(notif.createdAt)}
                                    </span>
                                    {notif.orderId && (
                                        <span className="text-purple-400/80">Order Ref: #{notif.orderId.substring(notif.orderId.length - 6).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>

                            <ChevronRight size={18} className="text-gray-700 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
