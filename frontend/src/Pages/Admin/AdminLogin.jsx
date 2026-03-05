import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            // res.data -> { status: "success", data: { jwt_token: "..." } }
            const res = await adminLogin(form);
            const { jwt_token } = res.data.data;

            localStorage.setItem("adminToken", jwt_token);
            toast.success("Welcome back, Admin!");

            // Ensure we have a user object for AdminRoute check if it uses useAuth()
            // But AdminRoute usually checks role.
            // For now, let's just navigate.
            navigate("/admin");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 font-sans selection:bg-fuchsia-500/30">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <Link to="/" className="text-4xl font-black text-fuchsia-500 tracking-tighter hover:opacity-80 transition-opacity">
                        BaeBy.<span className="text-gray-400">ADMIN</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-[#1F2937] border border-gray-700 rounded-[32px] p-10 sm:p-12 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500" />

                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                            Admin Access
                        </h2>
                        <p className="text-gray-400 text-sm font-medium">
                            Enter secure credentials to manage your store
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                                Admin Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="admin@baeby.com"
                                className="w-full bg-[#111827] border border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/10 transition-all text-white font-medium placeholder:text-gray-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                                Security Key
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-[#111827] border border-gray-600 rounded-2xl px-5 py-4 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/10 transition-all text-white font-medium placeholder:text-gray-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-[50px] font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? "Verifying..." : "Authorized Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-xs text-gray-500 hover:text-fuchsia-400 font-medium transition-colors">
                            Return to Customer Portal
                        </Link>
                    </div>
                </div>

                <p className="text-center mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    Secure Administrative Gateway &bull; BaeBy Backend v2.0
                </p>
            </div>
        </div>
    );
}
