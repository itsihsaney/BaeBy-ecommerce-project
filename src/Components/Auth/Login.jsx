// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";
// import toast from "react-hot-toast";
// import axios from "axios";

// function Login() {
//   const { setUser, user } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [showRoleModal, setShowRoleModal] = useState(false); //  For admin choose modal
//   const [tempUser, setTempUser] = useState(null); // to store found user temporarily

//   // ✅ Auto redirect if already logged in
//   useEffect(() => {
//     if (user) {
//       if (user.role === "admin") navigate("/admin");
//       else navigate("/");
//     }
//   }, [user, navigate]);

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const { data } = await axios.get("http://localhost:5001/users");

//       const foundUser = data.find(
//         (u) =>
//           u.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
//           u.password === form.password
//       );

//       if (!foundUser) {
//         setError("Invalid email or password");
//         toast.error("Invalid login credentials");
//         return;
//       }

//       // 🧠 If it's an admin, ask where to go
//       if (foundUser.role === "admin") {
//         setTempUser(foundUser);
//         setShowRoleModal(true);
//       } else {
//         // Normal user
//         setUser(foundUser);
//         localStorage.setItem("user", JSON.stringify(foundUser));
//         toast.success("You are successfully logged in!");
//         navigate("/");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//       toast.error("Something went wrong.");
//     }
//   };

//   //  Handle role selection for admin
//   const handleRoleChoice = (path) => {
//     if (!tempUser) return;
//     setUser(tempUser);
//     localStorage.setItem("user", JSON.stringify(tempUser));
//     setShowRoleModal(false);
//     toast.success(
//       path === "/admin" ? "Welcome back, Admin!" : "Logged in as user!"
//     );
//     navigate(path);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
//       <div className="relative w-full max-w-md">
//         {/* glass card */}
//         <div className="backdrop-blur-sm bg-white/30 border border-white/20 rounded-3xl shadow-2xl p-8">
//           <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
//             Welcome Back
//           </h2>
//           <p className="text-sm text-gray-700 text-center mb-6">
//             Login to continue to <span className="font-semibold">BaeBy</span>
//           </p>

//           {error && (
//             <div className="text-red-500 text-sm text-center mb-4">{error}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email Input */}
//             <div className="relative">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-pink-300 focus:shadow-[0_0_12px_rgba(236,72,153,0.15)] transition"
//                 placeholder="Email"
//                 required
//               />
//               <label
//                 htmlFor="email"
//                 className="absolute left-4 -top-2 text-sm text-gray-700 bg-white/40 px-2 rounded-md pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
//               >
//                 Email
//               </label>
//             </div>

//             {/* Password Input */}
//             <div className="relative">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="peer w-full bg-transparent border border-white/25 rounded-xl px-4 py-3 outline-none placeholder-transparent focus:ring-2 focus:ring-pink-300 focus:shadow-[0_0_12px_rgba(232,121,249,0.12)] transition"
//                 placeholder="Password"
//                 required
//               />
//               <label
//                 htmlFor="password"
//                 className="absolute left-4 -top-2 text-sm text-gray-700 bg-white/40 px-2 rounded-md pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
//               >
//                 Password
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg shadow-pink-300/30"
//             >
//               Login
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-700 mt-5">
//             Don’t have an account?{" "}
//             <Link to="/register" className="text-pink-500 font-semibold">
//               Create one
//             </Link>
//           </p>
//         </div>

//         {/* neon glow */}
//         <div
//           className="absolute -inset-1 rounded-3xl blur-xl opacity-30 pointer-events-none"
//           style={{
//             background: "linear-gradient(90deg,#ff7ab6,#8b5cf6,#60a5fa)",
//           }}
//         />
//       </div>

//       {/* 🌟 Modal for Admin Role Choice */}
//       {showRoleModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center">
//             <h3 className="text-xl font-bold text-gray-800 mb-3">
//               You’re an Admin!
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Would you like to login as Admin or view as a regular User?
//             </p>

//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => handleRoleChoice("/admin")}
//                 className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
//               >
//                 Admin
//               </button>
//               <button
//                 onClick={() => handleRoleChoice("/")}
//                 className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
//               >
//                 User
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;





import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

function Login() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  // ✅ Auto redirect if already logged in
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
      const { data } = await axios.get("http://localhost:5001/users");

      const foundUser = data.find(
        (u) =>
          u.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
          u.password === form.password
      );

      if (!foundUser) {
        setError("Invalid email or password");
        toast.error("Invalid login credentials");
        return;
      }

      // 🧠 If it's an admin, show modal
      if (foundUser.role === "admin") {
        setTempUser(foundUser);
        setShowRoleModal(true);
      } else {
        // Normal user flow
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        toast.success("You are successfully logged in!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    }
  };

  // ✅ Handle role selection for admin (fixed navigate timing)
  const handleRoleChoice = (path) => {
    if (!tempUser) return;

    setUser(tempUser);
    localStorage.setItem("user", JSON.stringify(tempUser));
    setShowRoleModal(false);

    // ⏳ Wait a tiny moment for React to update state before navigating
    setTimeout(() => {
      toast.success(
        path === "/admin" ? "Welcome back, Admin!" : "Logged in as User!"
      );
      navigate(path);
    }, 200);
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
            {/* Email Input */}
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

            {/* Password Input */}
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

        {/* neon glow */}
        <div
          className="absolute -inset-1 rounded-3xl blur-xl opacity-30 pointer-events-none"
          style={{
            background: "linear-gradient(90deg,#ff7ab6,#8b5cf6,#60a5fa)",
          }}
        />
      </div>

      {/* 🌟 Modal for Admin Role Choice */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              You’re an Admin!
            </h3>
            <p className="text-gray-600 mb-6">
              Would you like to login as Admin or view as a regular User?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRoleChoice("/admin")}
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleChoice("/")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
