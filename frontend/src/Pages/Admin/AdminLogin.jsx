import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { adminLogin } from "../../api/adminApi";
import toast from "react-hot-toast";

export default function AdminLogin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in as admin with correct token
    useEffect(() => {
        if (localStorage.getItem("adminToken")) {
            navigate("/admin");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await adminLogin(form);
            const { jwt_token } = res.data.data;

            localStorage.setItem("adminToken", jwt_token);
            toast.success("Welcome back, Admin!");
            navigate("/admin");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-gray-100 bg-[#050505] selection:bg-violet-500/30 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-lg mx-auto flex flex-col justify-center px-4 sm:px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block group">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:scale-105 transition-transform duration-300">
                                B
                            </div>
                            <span className="text-3xl font-black text-white tracking-tight">
                                BaeBy<span className="text-violet-500">.</span>
                            </span>
                        </div>
                    </Link>
                    <p className="text-gray-400 font-medium tracking-wide text-sm uppercase mt-6">
                        Administrative Workspace
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-[#0f0f11] border border-white/[0.05] rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group/card backdrop-blur-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 opacity-80" />

                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            Sign In to Dashboard
                        </h2>
                        <p className="text-sm text-gray-500">
                            Enter your admin credentials to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 relative">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@baeby.com"
                                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-white font-medium placeholder:text-gray-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">
                                Master Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-white font-medium placeholder:text-gray-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none mt-4 text-sm"
                        >
                            {loading ? (
                                "Connecting..."
                            ) : (
                                <>
                                    Authorize Access <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/[0.05] text-center">
                        <Link to="/login" className="text-sm text-gray-500 hover:text-violet-400 font-medium transition-colors">
                            Return to Customer Portal
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-600 font-semibold tracking-wider flex items-center justify-center gap-2">
                        <Lock size={12} className="text-violet-500" /> Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
}
