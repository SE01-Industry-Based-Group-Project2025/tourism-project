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

// Hardcode the current path for now; we'll replace this with React Router later.
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
    <div className="w-64 bg-[#0f4c81] text-white min-h-screen flex flex-col">
      {/* Logo header */}
      <div className="h-20 flex items-center justify-center p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Compass className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">SLTOURPAL</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === currentPath;

            return (
              <li key={to}>
                <a
                  href={to}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-white text-[#0f4c81] font-semibold" 
                      : "hover:bg-white/10 text-white"
                    }
                  `}
                >
                  <Icon 
                    className={`h-5 w-5 ${isActive ? "text-[#0f4c81]" : "text-white"}`} 
                  />
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile footer */}
      <div className="p-4 border-t border-white/20">
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
      </div>
    </div>
  );
}