import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color = 'violet' }) {
    const colorMap = {
        violet: "from-violet-500/20 to-violet-600/5 text-violet-500",
        blue: "from-blue-500/20 to-blue-600/5 text-blue-500",
        emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-500",
        rose: "from-rose-500/20 to-rose-600/5 text-rose-500",
        purple: "from-purple-500/20 to-purple-600/5 text-purple-500"
    };

    const shadowMap = {
        violet: "hover:shadow-violet-500/10 hover:border-violet-500/30",
        blue: "hover:shadow-blue-500/10 hover:border-blue-500/30",
        emerald: "hover:shadow-emerald-500/10 hover:border-emerald-500/30",
        rose: "hover:shadow-rose-500/10 hover:border-rose-500/30",
        purple: "hover:shadow-purple-500/10 hover:border-purple-500/30"
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-[#111111]/80 backdrop-blur-3xl p-6 rounded-3xl flex items-center gap-5 border border-white/[0.05] shadow-lg relative overflow-hidden transition-all duration-300 ${shadowMap[color]}`}
        >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${colorMap[color]} blur-2xl opacity-40 pointer-events-none`}></div>

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorMap[color]} relative z-10 border border-white/[0.02]`}>
                {Icon && <Icon size={24} />}
            </div>

            <div className="relative z-10">
                <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase mb-1">{title}</p>
                <p className="text-3xl font-black text-white tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
}
