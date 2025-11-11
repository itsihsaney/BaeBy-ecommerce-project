import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../Context/AuthContext";


export default function TopBar({ onMenuClick }) {
  const [admin, setAdmin] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // ✅ Load admin info (from localStorage or API)
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      axios
        .get("http://localhost:5001/users")
        .then((res) => {
          const adminUser = res.data.find((u) => u.role === "admin");
          if (adminUser) {
            setAdmin(adminUser);
            localStorage.setItem("admin", JSON.stringify(adminUser));
          }
        })
        .catch((err) => console.error("Error fetching admin:", err));
    }
  }, []);

  const handleLogout = () => {
  try {
    // Clear admin session
    localStorage.removeItem("admin");
    setAdmin(null);
    setShowLogoutModal(false);
    logout()

    // Force navigation after small delay (React state cleanup)
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 200);
  } catch (err) {
    console.error("Logout error:", err);
  }
};


  return (
    <>
      {/* ===== TopBar Header ===== */}
      <header className="sticky top-0 z-[9999] bg-[#1F2937]/95 backdrop-blur-md shadow-lg border-b border-fuchsia-700/30 px-6 py-4 flex justify-between items-center">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-gray-300 hover:text-fuchsia-400 transition"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-semibold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        {/* Right: Admin Info + Logout */}
        <div className="flex items-center gap-5">
          {admin ? (
            <>
              <div className="text-right">
                <p className="font-medium text-gray-200">{admin.name}</p>
                <p className="text-sm text-gray-400">{admin.email}</p>
              </div>

              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-900 flex items-center justify-center text-white font-bold">
                {admin.name.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Loading admin...</p>
          )}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-5 py-2 rounded-lg text-white font-medium shadow-md hover:opacity-90 transition flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* ===== Centered Logout Modal ===== */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000]">
          <div className="bg-[#1E1E2A] border border-fuchsia-700/30 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-fuchsia-400 transition text-xl"
            >
              ✖
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold text-fuchsia-300 mb-3">
              Confirm Logout
            </h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Are you sure you want to log out from your admin account?
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
