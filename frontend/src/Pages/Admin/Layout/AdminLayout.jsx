import React, { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-violet-500/30">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 custom-scrollbar pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30 transition-opacity duration-300"
        />
      )}
    </div>
  );
}
