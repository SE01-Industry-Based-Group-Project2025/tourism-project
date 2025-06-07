// src/components/ui/avatar.jsx
import React from "react";

export function Avatar({ className = "", children, ...rest }) {
  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, ...rest }) {
  return <img src={src} alt={alt} className="h-full w-full object-cover" {...rest} />;
}

export function AvatarFallback({ className = "", children, ...rest }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gray-300 text-gray-600 font-medium ${className}`} {...rest}>
      {children}
    </div>
  );
}