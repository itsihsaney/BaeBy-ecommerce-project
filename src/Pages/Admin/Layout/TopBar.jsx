import React from "react";
import { Menu } from "lucide-react";

export default function TopBar({ onMenuClick, admin }) {
  return (
    <header className="bg-[#1F2937] shadow-md border-b border-fuchsia-700/30 px-6 py-4 flex justify-between items-center">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
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

      {/* Right: Admin Info */}
      <div className="flex items-center gap-5">
        {/* Admin Details */}
        <div className="text-right">
          <p className="font-medium text-gray-200">{admin.name}</p>
          <p className="text-sm text-gray-400">{admin.email}</p>
        </div>

        {/* Avatar Placeholder */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 flex items-center justify-center text-white font-bold">
          {admin.name.charAt(0)}
        </div>

        {/* Logout Button */}
        <button className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-5 py-2 rounded-lg text-white font-medium shadow-md hover:opacity-90 transition">
          Logout
        </button>
      </div>
    </header>
  );
}
