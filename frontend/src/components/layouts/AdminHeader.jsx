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
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* LEFT: Title + Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* RIGHT: Bell + Avatar Dropdown */}
        <div className="flex items-center gap-4">
          {/* 1) Notifications (Bell) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-gray-800"
              >
                <Bell className="h-5 w-5" />
                {/* Red "ping" badge */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="font-medium">New booking request</p>
                <p className="text-xs text-gray-500">John Doe requested a quote for Wild Sri Lanka tour</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="font-medium">Payment received</p>
                <p className="text-xs text-gray-500">Payment of $500 received for booking #1234</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-[#0f4c81] hover:text-[#0d3d66]">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2) Avatar + DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-1 h-auto hover:bg-gray-100 rounded-lg"
              >                {/* Avatar Circle */}
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxVc2VyfGVufDB8fHx8MTc0OTEwNjMzOHww&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt={`${user?.firstName || 'Admin'} ${user?.lastName || 'User'} Avatar`}
                  />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>

                {/* Name + Role */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'User'}
                  </p>
                </div>

                {/* Chevron Down */}
                <ChevronDown className="h-4 w-4 text-gray-600 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@sltourpal.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}