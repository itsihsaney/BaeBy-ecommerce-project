import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

export default function SideBar({ isOpen, setIsOpen }) {
  const baseClasses =
    "block py-3 px-5 rounded-md font-medium transition duration-200";
  const activeClass =
    "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-md";
  const inactiveClass =
    "text-gray-300 hover:bg-[#312E81]/40 hover:text-fuchsia-300";

  return (
    <aside
      className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-[#1F2937] border-r border-fuchsia-700/40 p-6 flex flex-col transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {/* ✅ Baeby Logo */}
          <img
            src="/BaeBy Official Logo.jpg"
            alt="Baeby Logo"
            className="h-10 w-10 object-contain rounded-lg shadow-md"
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Baeby Admin
          </h2>
        </div>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-gray-400 hover:text-fuchsia-400 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : inactiveClass}`
          }
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : inactiveClass}`
          }
          onClick={() => setIsOpen(false)}
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : inactiveClass}`
          }
          onClick={() => setIsOpen(false)}
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClass : inactiveClass}`
          }
          onClick={() => setIsOpen(false)}
        >
          Users
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-xs text-gray-500 border-t border-fuchsia-800/30 pt-4">
        <p>© 2025 Baeby Admin</p>
      </div>
    </aside>
  );
}
