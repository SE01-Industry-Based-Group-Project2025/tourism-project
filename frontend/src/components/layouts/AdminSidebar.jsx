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
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import {NavLink, useLocation} from "react-router-dom"; // Import NavLink and useLocation for routing

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/templates", label: "Templates", icon: Map },
  { to: "/admin/tours", label: "Tours", icon: Compass },
  { to: "/admin/places", label: "Places", icon: MapPin },
  { to: "/admin/quote-requests", label: "Quote Requests", icon: MessageSquareQuote },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const location = useLocation();
  
  return (    <Sidebar className="w-64 bg-gradient-to-b from-slate-900 via-blue-900/95 to-purple-900/90 backdrop-blur-xl text-white min-h-screen flex flex-col shadow-2xl border-r border-white/10">
      {/* Logo header */}
      <SidebarHeader className="h-24 flex items-center justify-center p-6 border-b border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <Compass className="h-8 w-8 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-wide drop-shadow-sm">SLTOURPAL</span>
            <span className="text-xs text-white/70 font-medium tracking-wider">Tourism Admin</span>
          </div>
        </div>
      </SidebarHeader>      {/* Nav items */}
      <SidebarContent className="px-4 py-6 flex-1 overflow-hidden">
        <SidebarMenu className="space-y-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={to}
                    className={
                      "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden " +
                      (isActive
                        ? "bg-gradient-to-r from-white/95 to-white/90 text-slate-800 shadow-xl shadow-white/20 scale-[1.02] border border-white/30"
                        : "hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 text-white hover:scale-[1.01] hover:shadow-lg hover:shadow-white/10 border border-transparent hover:border-white/20")
                    }
                  >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30" 
                        : "bg-white/10 group-hover:bg-gradient-to-br group-hover:from-blue-500/50 group-hover:to-purple-500/50 backdrop-blur-sm"
                    }`}>
                      <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                        isActive 
                          ? "text-white" 
                          : "text-white group-hover:scale-110"
                      }`} />
                    </div>
                    <span className={`font-semibold text-sm transition-all duration-300 ${
                      isActive ? "text-slate-800" : "text-white"
                    }`}>
                      {label}
                    </span>
                    {isActive && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/50"></div>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}