import React, { useEffect, useState } from "react";
import axios from "axios";
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

const COLORS = ["#C084FC", "#E879F9", "#F472B6", "#F9A8D4"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    totalSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [profit, setProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  //  Helper to clean "$" and ensure number
  const cleanPrice = (val) => {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/[^0-9.]/g, "")) || 0;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, orders, products] = await Promise.all([
          axios.get("http://localhost:5001/users"),
          axios.get("http://localhost:5001/orders"),
          axios.get("http://localhost:5001/products"),
        ]);

        //  Calculate totals correctly
        const totalSales = orders.data.reduce(
          (sum, o) =>
            sum +
            cleanPrice(o.price || o.totalAmount || 0),
          0
        );

        const latestOrders = [...orders.data]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);

        const calculatedProfit = totalSales * 0.25;

        setStats({
          users: users.data.length,
          orders: orders.data.length,
          products: products.data.length,
          totalSales: totalSales.toFixed(2),
        });
        setProfit(calculatedProfit.toFixed(2));
        setRecentOrders(latestOrders);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <p className="text-fuchsia-300 text-lg p-6 animate-pulse">
        Loading dashboard...
      </p>
    );

  const barData = [
    { name: "Users", value: stats.users },
    { name: "Products", value: stats.products },
    { name: "Orders", value: stats.orders },
  ];

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Orders", value: stats.orders },
    { name: "Products", value: stats.products },
  ];

  return (
    <div className="min-h-screen  bg-[#111827] text-gray-200 p-6 ">
      {/* ===== Header ===== */}
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
        Baeby Admin Dashboard
      </h1>

      {/* ===== Stat Cards ===== */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 ">
        <AnimatedStatCard title="Total Users" value={stats.users} color="from-fuchsia-600 to-pink-500" />
        <AnimatedStatCard title="Total Products" value={stats.products} color="from-violet-500 to-fuchsia-400" />
        <AnimatedStatCard title="Total Orders" value={stats.orders} color="from-pink-500 to-purple-500" />
        <AnimatedStatCard
          title="Total Sales"
          value={`$${stats.totalSales}`}
          color="from-purple-600 to-fuchsia-500"
          isCurrency
        />
      </div>

      {/* ===== Charts Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 ">
        <ChartCard title="Data Overview">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#D8B4FE" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #C084FC",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#F9A8D4" }}
              />
              <Bar dataKey="value" fill="#C084FC" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#C084FC"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#111827"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #C084FC",
                }}
                itemStyle={{ color: "#F9A8D4" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ===== Recent Orders + Insights ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/*  Recent Orders */}
        <div className="bg-[#1F2937] rounded-2xl shadow-lg p-6 border border-purple-600/30">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-purple-700/30 rounded-lg">
              <thead>
                <tr className="bg-purple-900/20 text-purple-300 text-sm uppercase">
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-purple-800/20 hover:bg-purple-900/10 transition"
                  >
                    <td className="py-3 px-4 text-gray-300">{order.id}</td>
                    <td className="py-3 px-4 text-gray-300">{order.shippingName || order.name}</td>
                    <td className="py-3 px-4 text-pink-300 font-semibold">
                      ${cleanPrice(order.price || order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status?.toLowerCase().includes("pending")
                            ? "bg-yellow-500/20 text-yellow-300"
                            : order.status?.toLowerCase().includes("delivered")
                            ? "bg-green-500/20 text-green-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/*  Insights */}
        <div className="bg-[#1F2937] rounded-2xl shadow-lg p-6 border border-purple-600/30">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">
            Business Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InsightCard title="Total Profit" value={`$${profit}`} />
            <InsightCard title="Conversion Rate" value="7.2%" />
            <InsightCard title="Returning Customers" value="11%" />
            <InsightCard title="Avg. Order Value" value="$758" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Chart Wrapper ===== */
function ChartCard({ title, children }) {
  return (
    <div className="bg-[#1F2937] rounded-2xl shadow-lg p-6 border border-purple-700/30">
      <h2 className="text-lg font-semibold mb-4 text-purple-300">{title}</h2>
      {children}
    </div>
  );
}

/* ===== Animated Stat Card ===== */
function AnimatedStatCard({ title, value, color, isCurrency = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value.toString().replace(/[^0-9.]/g, "")) || 0;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(isCurrency ? `$${start.toFixed(2)}` : start.toFixed(0));
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-md hover:shadow-purple-500/40 hover:scale-105 transform transition`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-medium mb-2 opacity-90">{title}</h3>
      <p className="text-3xl font-bold">{displayValue}</p>
    </motion.div>
  );
}

/* ===== Insight Card ===== */
function InsightCard({ title, value }) {
  return (
    <div className="bg-[#111827] border border-purple-700/30 rounded-xl p-4 text-center hover:bg-purple-900/20 transition">
      <h4 className="text-purple-400 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-pink-300 mt-1">{value}</p>
    </div>
  );
}
