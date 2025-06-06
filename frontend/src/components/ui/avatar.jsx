// src/components/ui/avatar.jsx
import React from "react";

export function Avatar({ className = "", children, ...rest }) {
  return (
    <div className={`rounded-full overflow-hidden ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, ...rest }) {
  return <img src={src} alt={alt} className="block w-full h-full object-cover" {...rest} />;
}

export function AvatarFallback({ children, ...rest }) {
  return (
    <div className="flex items-center justify-center bg-gray-300 w-full h-full" {...rest}>
      <span>{children}</span>
    </div>
  );
}
