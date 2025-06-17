// src/components/layouts/AdminLayout.jsx

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet, useLocation } from "react-router-dom"; 

/**
 * AdminLayout
 * Props:
 *  - children: ReactNode (the "main content" to render to the right of the sidebar)
 */
export default function AdminLayout() {
  const location = useLocation();
  
  // Define titles and subtitles for each route
  const getPageInfo = (pathname) => {
    switch (pathname) {
      case '/admin/dashboard':
        return {
          title: "Dashboard",
          subtitle: "Welcome to the SLTOURPAL Admin Dashboard"
        };
      case '/admin/tours':
        return {
          title: "Tours Management",
          subtitle: "Oversee and manage all tour packages"
        };
      case '/admin/places':
        return {
          title: "Places Management", 
          subtitle: "Manage destinations and activities across Sri Lanka"
        };
      case '/admin/users':
        return {
          title: "Users Management",
          subtitle: "Manage users, guides, and administrators"
        };
      case '/admin/quote-requests':
        return {
          title: "Quote Requests",
          subtitle: "Manage and respond to customer quote requests"
        };
      case '/admin/reviews':
        return {
          title: "Reviews Management",
          subtitle: "Monitor and manage customer reviews and ratings"
        };
      case '/admin/analytics':
        return {
          title: "Analytics Dashboard",
          subtitle: "Track performance metrics and business insights"
        };
      default:
        return {
          title: "Admin Panel",
          subtitle: "SLTOURPAL Administration"
        };
    }
  };

  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar occupies fixed width on left */}
      <AdminSidebar />

      {/* Right‐hand column: header + content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          title={title}
          subtitle={subtitle}
        />

        {/* Main content area (scrollable) */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
