import React, { useState, useContext } from "react";
import { Menu, LogOut, Bell, Search, User as UserIcon } from "lucide-react";
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
      <header className="sticky top-0 z-[10] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center transition-all">
        {/* Left: Menu & Search */}
        <div className="flex items-center gap-6">
          <button
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 focus-within:ring-1 focus-within:ring-violet-500/50 focus-within:border-violet-500/50 transition-all w-64 lg:w-96 shadow-inner pointer-events-none">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none w-full text-white placeholder-gray-500 pointer-events-auto"
            />
          </div>
        </div>

        {/* Right: Notifications, User Info + Logout */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Notifications Placeholder */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
          </button>

          <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

          {adminInfo ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-200 text-sm">
                  {adminInfo.name}
                </p>
                <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">
                  {adminInfo.role}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30 ring-2 ring-white/10">
                {adminInfo.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 ring-2 ring-white/5">
              <UserIcon size={18} />
            </div>
          )}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm group"
          >
            <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
            <span className="group-hover:text-red-400 transition-colors font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[500] p-4 transition-opacity">
          <div className="bg-[#0f0f11] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transform scale-100 transition-transform">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <LogOut size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Ready to leave?
            </h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Are you sure you want to log out from the admin session? You will need to sign in again.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl font-medium transition text-sm border border-white/5 hover:border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 py-2.5 rounded-xl text-white font-medium transition shadow-lg shadow-red-500/25 text-sm"
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
