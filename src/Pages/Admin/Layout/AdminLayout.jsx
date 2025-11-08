import React, { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Example admin info (can be fetched dynamically later)
  const admin = {
    name: "Mohammed Ihsan",
    email: "ihsan@baeby.com",
  };

  return (
    <div className="flex min-h-screen bg-[#111827] text-gray-100 relative">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col ">

        <TopBar
          admin={admin}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
        />
      )}
    </div>
  );
}
