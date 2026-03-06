import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/admin/Sidebar";
import TopNavbar from "../Components/admin/TopNavbar";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#0A0A0B] min-h-screen text-gray-100 selection:bg-purple-500/30 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Top navbar */}
                <TopNavbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
