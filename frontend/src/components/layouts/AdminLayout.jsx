// src/components/layouts/AdminLayout.jsx

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom"; 
/**
 * AdminLayout
 * Props:
 *  - children: ReactNode (the “main content” to render to the right of the sidebar)
 */
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar occupies fixed width on left */}
      <AdminSidebar />

      {/* Right‐hand column: header + content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          title="Tour Management"
          subtitle="Oversee and manage all tour packages."
        />

        {/* Main content area (scrollable) */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
