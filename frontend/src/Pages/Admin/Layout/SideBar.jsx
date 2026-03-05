import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users as UsersIcon, Truck, X, Layers } from "lucide-react";

export default function SideBar({ isOpen, setIsOpen }) {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: ShoppingBag },
    { to: "/admin/orders", label: "Orders", icon: Truck },
    { to: "/admin/users", label: "Users", icon: UsersIcon },
  ];

  return (
    <aside
      className={`fixed lg:static z-40 top-0 left-0 h-screen w-72 bg-[#0a0a0a]/95 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Layers className="text-white h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
            Baeby Admin
          </h2>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Overview
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${isActive
                ? "bg-violet-500/10 text-violet-400"
                : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`transition-colors ${isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 py-4 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-violet-600/20 flex items-center justify-center">
            <span className="text-violet-400 font-bold text-xs">V2</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">Admin Portal</p>
            <p className="text-xs text-gray-500">v2.0.1 Update</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
