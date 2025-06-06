// src/components/layouts/AdminLayout.jsx

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/**
 * AdminLayout
 * Props:
 *  - children: ReactNode (the “main content” to render to the right of the sidebar)
 */
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar occupies fixed width on left */}
      <AdminSidebar />

      {/* Right‐hand column: header + content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <AdminHeader
          title="Tour Management"
          subtitle="Oversee and manage all tour packages."
        />

        {/* Main content area (scrollable) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
