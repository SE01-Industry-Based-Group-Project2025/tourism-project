// src/components/layouts/AdminSidebar.jsx

import React from "react";
import {
  Compass,
  LayoutDashboard,
  Map,
  MessageSquareQuote,
  Users,
  Star,
  BarChart3,
  MapPin,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import {NavLink, useLocation} from "react-router-dom"; // Import NavLink and useLocation for routing

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/tours", label: "Tours", icon: Map },
  { to: "/admin/places", label: "Places", icon: MapPin },
  { to: "/admin/quote-requests", label: "Quote Requests", icon: MessageSquareQuote },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="w-64 bg-gradient-to-b from-[#0f4c81] via-[#1e5f99] to-[#0f4c81] text-white min-h-screen flex flex-col shadow-2xl border-r border-white/10">
      {/* Logo header */}
      <SidebarHeader className="h-24 flex items-center justify-center p-6 border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <Compass className="h-10 w-10 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">SLTOURPAL</span>
            <span className="text-xs text-white/70 font-medium">Tourism Admin</span>
          </div>
        </div>
      </SidebarHeader>      {/* Nav items */}
      <SidebarContent className="px-3 py-6 flex-1 overflow-hidden">
        <SidebarMenu className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={to}
                    className={
                      "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden " +
                      (isActive
                        ? "bg-white text-[#0f4c81] shadow-lg shadow-white/20 scale-[1.02]"
                        : "hover:bg-white/15 text-white hover:scale-[1.01] hover:shadow-md hover:shadow-white/10")
                    }
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? "bg-[#0f4c81]/10" 
                        : "bg-white/10 group-hover:bg-white/20"
                    }`}>
                      <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                        isActive 
                          ? "text-[#0f4c81]" 
                          : "text-white group-hover:scale-110"
                      }`} />
                    </div>
                    <span className={`font-medium text-sm transition-all duration-300 ${
                      isActive ? "text-[#0f4c81]" : "text-white"
                    }`}>
                      {label}
                    </span>
                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0f4c81] rounded-l-full"></div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>      {/* Profile footer */}
      <SidebarFooter className="p-4 mt-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
          </div>
        </div>

        {/* Collapsed avatar button (still hidden) */}
        <div className="hidden mt-2">
          <SidebarMenuButton asChild>
            <a
              href="/admin/profile"
              className="h-8 w-8 rounded-full bg-gray-300 block"
            />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}