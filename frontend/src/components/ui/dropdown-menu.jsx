// src/components/ui/dropdown-menu.jsx
import React from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block text-left">{children}</div>;
}

export function DropdownMenuTrigger({ asChild = false, children }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children);
  }
  return <button>{children}</button>;
}

export function DropdownMenuContent({ align, className = "", children }) {
  return (
    <div
      className={`absolute ${align === "end" ? "right-0" : "left-0"} mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children }) {
  return <div className="px-4 py-2 text-sm font-semibold text-gray-700">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 my-1" />;
}

export function DropdownMenuItem({ children }) {
  return <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">{children}</div>;
}
