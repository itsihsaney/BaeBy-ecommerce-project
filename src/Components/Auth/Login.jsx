import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";


function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // if already logged in, go home
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await login(form.email.trim(), form.password);
    if (res.success) {
      toast.success("You are successfully logged in!");
      navigate("/");
    } else {
      setError(res.message);
      toast.error("Invalid login credentials");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong. Please try again.");
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <div className="relative w-full max-w-md">
        {/* glass card */}
        <div className="backdrop-blur-sm bg-white/30 border border-white/20 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-700 text-center mb-6">
            Login to continue to <span className="font-semibold">BaeBy</span>
          </p>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* floating label input - Email */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-pink-300 focus:shadow-[0_0_12px_rgba(236,72,153,0.15)] transition"
                placeholder="Email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2 text-sm text-gray-700 bg-white/40 px-2 rounded-md pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
              >
                Email
              </label>
            </div>

            {/* floating label input - Password */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-pink-300 focus:shadow-[0_0_12px_rgba(232,121,249,0.12)] transition"
                placeholder="Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2 text-sm text-gray-700 bg-white/40 px-2 rounded-md pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
              >
                Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg shadow-pink-300/30"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-5">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-500 font-semibold">
              Create one
            </Link>
          </p>
        </div>

        {/* little neon accent */}
        <div className="absolute -inset-1 rounded-3xl blur-xl opacity-30 pointer-events-none"
             style={{ background: "linear-gradient(90deg,#ff7ab6,#8b5cf6,#60a5fa)" }} />
      </div>
    </div>
  );
}

export default Login;
