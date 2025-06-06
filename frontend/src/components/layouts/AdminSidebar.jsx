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

// Hardcode the current path for now; we’ll replace this with React Router later.
const currentPath = "/admin/dashboard";

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
  return (
    <Sidebar className="w-64 bg-blue-800 text-white min-h-screen flex flex-col">
      {/* Logo header */}
      <SidebarHeader className="h-20 flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <Compass className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">SLTOURPAL</span>
        </div>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent className="p-2 flex-1 overflow-auto">
        <SidebarMenu className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === currentPath;

            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild className="block">
                  <a
                    href={to}
                    className={
                      "flex items-center gap-2 p-2 rounded-md " +
                      (isActive
                        ? "bg-white/20 text-blue-200"
                        : "hover:bg-blue-700 text-white")
                    }
                  >
                    <Icon className={"h-5 w-5 " + (isActive ? "text-blue-200" : "text-white")} />
                    <span>{label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Profile footer */}
      <SidebarFooter className="p-4 mt-auto">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <div>
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-blue-200">Administrator</p>
            </div>
          </div>
        </div>

        {/* Collapsed avatar button (still hidden) */}
        <div className="hidden mt-2">
          <SidebarMenuButton asChild className="block">
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
