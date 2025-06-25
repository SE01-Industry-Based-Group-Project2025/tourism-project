// src/components/layouts/AdminHeader.jsx
import React from "react";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/Dropdown-menu";
import { Button } from "../ui/Button";

/**
 * AdminHeader:
 * Props:
 *  - title: string (e.g. "Tour Management")
 *  - subtitle: string (e.g. "Oversee and manage all tour packages.")
 */
export default function AdminHeader({ title = "Dashboard", subtitle = "Welcome to SLTOURPAL Admin" }) {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if server call fails
      window.location.href = '/login';
    }
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "AU";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "AU";
  };  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* LEFT: Title + Subtitle */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">{title}</h1>
            <p className="text-sm text-gray-600/90 font-medium">{subtitle}</p>
          </div>
        </div>        {/* RIGHT: Bell + Avatar Dropdown */}
        <div className="flex items-center gap-4">
          {/* 1) Notifications (Bell) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 h-12 w-12"
              >
                <Bell className="h-5 w-5" />
                {/* Red "ping" badge */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 border-2 border-white shadow-lg"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
              <DropdownMenuLabel className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <DropdownMenuItem className="flex flex-col items-start gap-2 p-4 hover:bg-blue-50/80 rounded-xl m-1">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">New booking request</p>
                    <p className="text-xs text-gray-600">John Doe requested a quote for Wild Sri Lanka tour</p>
                    <p className="text-xs text-blue-600 font-medium">2 hours ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-2 p-4 hover:bg-green-50/80 rounded-xl m-1">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Payment received</p>
                    <p className="text-xs text-gray-600">Payment of $500 received for booking #1234</p>
                    <p className="text-xs text-green-600 font-medium">5 hours ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <DropdownMenuItem className="justify-center text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 font-semibold rounded-xl m-1">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>          {/* 2) Avatar + DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-2 h-auto hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl border border-transparent hover:border-blue-200/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* Avatar Circle */}
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                    <AvatarImage
                      src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxVc2VyfGVufDB8fHx8MTc0OTEwNjMzOHww&ixlib=rb-4.1.0&q=80&w=1080"}
                      alt={`${user?.firstName || 'Admin'} ${user?.lastName || 'User'} Avatar`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                {/* Name + Role */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-gray-800">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Admin User'}
                  </p>
                  <p className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                    {user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'User'}
                  </p>
                </div>

                {/* Chevron Down */}
                <ChevronDown className="h-4 w-4 text-gray-600 hidden md:block transition-transform duration-200 group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-blue-200">
                    <AvatarImage
                      src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxVc2VyfGVufDB8fHx8MTc0OTEwNjMzOHww&ixlib=rb-4.1.0&q=80&w=1080"}
                      alt={`${user?.firstName || 'Admin'} ${user?.lastName || 'User'} Avatar`}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@sltourpal.com'}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <DropdownMenuItem className="gap-3 p-3 hover:bg-blue-50/80 rounded-xl m-1">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-3 hover:bg-purple-50/80 rounded-xl m-1">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <DropdownMenuItem onClick={handleLogout} className="gap-3 p-3 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl m-1 font-semibold">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                  <LogOut className="h-4 w-4 text-white" />
                </div>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}