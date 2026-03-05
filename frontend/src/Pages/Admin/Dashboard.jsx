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
} from "recharts";
import { motion } from "framer-motion";
import { getStats, getOrders } from "../../api/adminApi";

const COLORS = ["#C084FC", "#E879F9", "#F472B6", "#F9A8D4"];

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
    // Check for "token" instead of "adminToken"
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          getStats(),
          getOrders(),
        ]);

        // res.data.data mapping
        const statsData = statsRes?.data?.data || {};

        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0,
          totalRevenue: statsData.totalRevenue || 0,
        });

        const orders = ordersRes?.data?.data || [];
        const latestOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentOrders(latestOrders);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111827]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-fuchsia-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111827]">
        <p className="text-red-400 font-semibold">{error}</p>
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
    <div className="p-6 bg-[#111827] text-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
        Baeby Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <AnimatedStatCard
          title="Total Users"
          value={stats.totalUsers}
          color="from-fuchsia-600 to-pink-500"
        />
        <AnimatedStatCard
          title="Total Products"
          value={stats.totalProducts}
          color="from-violet-500 to-fuchsia-400"
        />
        <AnimatedStatCard
          title="Total Orders"
          value={stats.totalOrders}
          color="from-pink-500 to-purple-500"
        />
        <AnimatedStatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          color="from-purple-600 to-fuchsia-500"
          isCurrency
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <ChartCard title="Data Overview">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#D8B4FE" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              />
              <Bar dataKey="value" fill="#C084FC" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} fill="#C084FC">
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#1F2937] rounded-2xl p-6 border border-fuchsia-500/10">
        <h2 className="text-xl font-semibold mb-6 text-fuchsia-300">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-700">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4 text-center">Amount</th>
                <th className="pb-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id || order._id}
                  className="border-b border-gray-800/50 hover:bg-white/5 transition"
                >
                  <td className="py-4 text-sm font-mono text-gray-400">
                    #{(order.id || order._id)?.toString().slice(-6).toUpperCase()}
                  </td>
                  <td className="py-4 text-sm text-gray-200">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="py-4 text-sm text-center font-semibold text-fuchsia-300">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-orange-500/10 text-orange-400"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <p className="text-center text-gray-500 mt-6 italic">
              No recent orders found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 border border-fuchsia-500/10 shadow-lg">
      <h2 className="text-lg font-semibold mb-6 text-fuchsia-300">{title}</h2>
      {children}
    </div>
  );
}

function AnimatedStatCard({ title, value, color, isCurrency = false }) {
  return (
    <motion.div
      className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-lg border border-white/10`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-gray-100/80 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold tracking-tight">
        {isCurrency ? `$${Number(value).toLocaleString()}` : value}
      </p>
    </motion.div>
  );
}