// src/components/layouts/AdminHeader.jsx

import React from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

/**
 * AdminHeader:
 * Props:
 *  - title: string (e.g. “Tour Management”)
 *  - subtitle: string (e.g. “Oversee and manage all tour packages.”)
 */
export default function AdminHeader({ title, subtitle }) {
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
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-800"
          >
            <Bell className="h-5 w-5" />
            {/* Red “ping” badge */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* 2) Avatar + DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-0 h-auto hover:bg-transparent focus:outline-none"
              >
                {/* Avatar Circle */}
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxVc2VyfGVufDB8fHx8MTc0OTEwNjMzOHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Admin User Avatar"
                  />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>

                {/* Name + Role */}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-600">Administrator</p>
                </div>

                {/* Chevron Down */}
                <ChevronDown className="h-4 w-4 text-gray-600 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
