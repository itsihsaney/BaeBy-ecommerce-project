import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setInfo("");

  if (!form.name.trim() || !form.email.trim() || !form.password) {
    setError("Please fill all fields");
    return;
  }

  const res = await register({
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
  });

  if (res.success) {
    setInfo("Registered! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1000);
  } else {
    setError(res.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/30 border border-white/20 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
            Create Account
          </h2>
          <p className="text-sm text-gray-700 text-center mb-6">
            Join <span className="font-semibold">BaeBy</span> — tiny trends, big smiles.
          </p>

          {error && <div className="text-red-500 text-sm text-center mb-3">{error}</div>}
          {info && <div className="text-green-600 text-sm text-center mb-3">{info}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-violet-200 focus:shadow-[0_0_12px_rgba(139,92,246,0.08)] transition"
                placeholder="Full name"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 -top-2 text-sm text-gray-700 bg-white/40 px-2 rounded-md pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
              >
                Full name
              </label>
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-pink-300 focus:shadow-[0_0_12px_rgba(236,72,153,0.08)] transition"
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

            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-pink-300 focus:shadow-[0_0_12px_rgba(232,121,249,0.08)] transition"
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
              className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-5">
            Already a member?{" "}
            <Link to="/login" className="text-pink-500 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="absolute -inset-1 rounded-3xl blur-xl opacity-30 pointer-events-none"
             style={{ background: "linear-gradient(90deg,#ff7ab6,#8b5cf6,#60a5fa)" }} />
      </div>
    </div>
  );
}

export default Register;
