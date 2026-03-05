import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { CreditCard, Package, ShoppingCart, Users } from "lucide-react";
import { getStats, getOrders } from "../../api/adminApi";
import { convertToINR } from "../../utils/currency";

const COLORS = ["#8B5CF6", "#6366F1", "#A855F7", "#EC4899"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard: if no adminToken present, redirect to admin login
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          getStats(),
          getOrders(),
        ]);

        // Backend format: { status: "success", data: { ... } }
        const statsData = statsRes?.data?.data || {};

        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0,
          totalRevenue: statsData.totalRevenue || 0,
        });

        // Backend format: { status: "success", data: [ ...orders ] }
        const orders = ordersRes?.data?.data || [];
        const latestOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentOrders(latestOrders);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
          return;
        }
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[60vh] gap-4">
        <p className="text-red-400 font-semibold text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition shadow-[0_0_15px_rgba(139,92,246,0.4)]"
        >
          Retry
        </button>
      </div>
    );
  }

  const barData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Products", value: stats.totalProducts },
    { name: "Orders", value: stats.totalOrders },
  ];

  const pieData = [
    { name: "Users", value: stats.totalUsers || 1 },
    { name: "Orders", value: stats.totalOrders || 1 },
    { name: "Products", value: stats.totalProducts || 1 },
  ];

  return (
    <div className="text-gray-200 p-2 md:p-6 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Overview
        </h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <AnimatedStatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="violet"
        />
        <AnimatedStatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="indigo"
        />
        <AnimatedStatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="pink"
        />
        <AnimatedStatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={CreditCard}
          color="purple"
          isCurrency
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <ChartCard title="Platform Metrics" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Data Distribution">
          <div className="relative h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={110}
                  innerRadius={80}
                  stroke="transparent"
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}
                  itemStyle={{ color: "#e4e4e7" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">{stats.totalOrders + stats.totalProducts + stats.totalUsers}</span>
              <span className="text-xs text-gray-400">Total Data</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0f0f11] rounded-3xl p-6 border border-white border-opacity-[0.05] shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6 text-white tracking-tight flex items-center gap-2">
            <ShoppingCart size={20} className="text-violet-500" />
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-white/10 uppercase tracking-wider">
                  <th className="pb-4 pr-4 font-medium">Order ID</th>
                  <th className="pb-4 pr-4 font-medium">Customer</th>
                  <th className="pb-4 text-center font-medium">Amount</th>
                  <th className="pb-4 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id || order._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 pr-4 text-sm font-mono text-gray-400 group-hover:text-violet-400 transition-colors">
                      #{(order.id || order._id)?.toString().slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">
                          {(order.user?.name || "G").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-gray-200 font-medium">
                            {order.user?.name || "Guest"}
                          </p>
                          {order.user?.email && (
                            <p className="text-xs text-gray-500">{order.user.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-center font-medium text-gray-200">
                      {convertToINR(order.totalAmount || 0)}
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium capitalize border ${order.status?.toLowerCase().includes("delivered")
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : order.status?.toLowerCase().includes("paid")
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Package size={32} className="mb-3 opacity-20" />
                <p className="italic">No recent orders found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-[#0f0f11] rounded-3xl p-6 border border-white border-opacity-[0.05] shadow-xl ${className}`}>
      <h2 className="text-lg font-bold mb-6 text-white tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function AnimatedStatCard({ title, value, icon: Icon, color, isCurrency = false }) {
  const colorMap = {
    violet: "from-violet-500/20 to-violet-600/5 text-violet-500 border-violet-500/20",
    indigo: "from-indigo-500/20 to-indigo-600/5 text-indigo-500 border-indigo-500/20",
    pink: "from-pink-500/20 to-pink-600/5 text-pink-500 border-pink-500/20",
    purple: "from-purple-500/20 to-purple-600/5 text-purple-500 border-purple-500/20",
  };

  const bgStyle = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden bg-[#0f0f11] rounded-3xl p-6 border border-white border-opacity-[0.05] shadow-xl`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${bgStyle} blur-2xl opacity-50`}></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <div className={`p-2 rounded-xl bg-gradient-to-br ${bgStyle}`}>
            <Icon size={18} />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight text-white">
            {isCurrency
              ? convertToINR(value)
              : Number(value).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}