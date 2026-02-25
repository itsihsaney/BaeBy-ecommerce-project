
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const { login, setUser, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form.email, form.password);

      if (!res.success) {
        setError(res.message);
        toast.error(res.message);
        return;
      }

      const loggedUser = res.user;

      // If it's an admin, show modal
      if (loggedUser.role === "admin") {
        setTempUser(loggedUser);
        setShowRoleModal(true);
      } else {
        toast.success("You are successfully logged in!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    }
  };

  const handleRoleChoice = (path) => {
    if (!tempUser) return;

    setUser(tempUser);
    localStorage.setItem("user", JSON.stringify(tempUser));
    setShowRoleModal(false);

    setTimeout(() => {
      toast.success(
        path === "/admin" ? "Welcome back, Admin!" : "Logged in as User!"
      );
      navigate(path);
    }, 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF9FA] px-4 font-sans selection:bg-pink-100 uppercase-inputs">
      <div className="w-full max-w-md animate-fadeIn">

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-black text-pink-500 tracking-tighter hover:opacity-80 transition-opacity">
            BaeBy.
          </Link>
        </div>

        {/* Soft Card Container */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white p-10 sm:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-3 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold text-center py-3 px-4 rounded-xl mb-6 border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all duration-200 placeholder:text-gray-300 text-[#0F172A] font-medium"
                placeholder="name@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all duration-200 placeholder:text-gray-300 text-[#0F172A] font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-[14px] px-[20px] rounded-[50px] font-semibold text-white bg-gradient-to-r from-[#FF2E93] via-[#C33CFF] to-[#8E3BFF] hover:-translate-y-[2px] hover:shadow-[0_10px_20px_rgba(142,59,255,0.3)] transition-all duration-300 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-sm font-medium text-gray-400">
              New to BaeBy?{" "}
              <Link to="/register" className="text-pink-500 font-bold hover:text-pink-600 transition-colors ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-8 text-xs text-gray-300 font-medium">
          Protected by Secure Auth &bull; &copy; 2026 BaeBy Store
        </p>
      </div>

      {/* Modal for Admin Role Choice */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[32px] shadow-2xl p-8 sm:p-10 w-full max-w-[360px] text-center">
            <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-3 tracking-tight">
              Admin Gateway
            </h3>
            <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed px-2">
              You possess administrative privileges. Choose your session perspective:
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRoleChoice("/admin")}
                className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98]"
              >
                Access Dashboard
              </button>
              <button
                onClick={() => handleRoleChoice("/")}
                className="w-full bg-gray-50 text-gray-500 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98]"
              >
                View as Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
