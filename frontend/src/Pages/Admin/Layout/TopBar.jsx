import React, { useState, useContext } from "react";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../Context/AuthContext";

export default function TopBar({ onMenuClick }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  // Read admin info directly from localStorage (set by AdminLogin)
  const getAdminInfo = () => {
    // Try AuthContext user first (if admin logged in via the main login page)
    if (user && user.role === "admin") return user;

    // Otherwise, decode a minimal display from nothing (token is opaque)
    return null;
  };

  const adminInfo = getAdminInfo();

  const handleLogout = () => {
    try {
      setShowLogoutModal(false);

      // Clear admin-specific token
      localStorage.removeItem("adminToken");

      // If user was also logged in via AuthContext, log them out too
      if (logout) logout();

      // Navigate to login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[100] bg-[#1F2937]/95 backdrop-blur-md shadow-lg border-b border-fuchsia-700/30 px-6 py-4 flex justify-between items-center">
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

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-4">
          {adminInfo ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-200 text-sm">
                  {adminInfo.name}
                </p>
                <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">
                  {adminInfo.role}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-fuchsia-500/20">
                {adminInfo.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
              <UserIcon size={18} />
            </div>
          )}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl border border-gray-700 hover:border-fuchsia-500/50 transition-all text-sm group"
          >
            <LogOut size={16} className="group-hover:text-fuchsia-400 transition-colors" />
            <span className="group-hover:text-fuchsia-400 transition-colors">Logout</span>
          </button>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
          <div className="bg-[#1E1E2A] border border-fuchsia-700/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-fuchsia-300 mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Are you sure you want to log out from the admin session?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl font-medium transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-fuchsia-600 to-pink-500 py-2.5 rounded-xl text-white font-bold hover:opacity-90 transition shadow-lg shadow-fuchsia-500/25 text-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
