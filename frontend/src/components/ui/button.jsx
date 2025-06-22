// src/components/ui/button.jsx
import React from "react";

const buttonVariants = {
  default: "bg-gradient-to-r from-[#0f4c81] to-[#0d3d66] text-white hover:from-[#0d3d66] hover:to-[#0a2d4d] shadow-lg hover:shadow-xl",
  ghost: "bg-transparent hover:bg-gray-100/80 backdrop-blur-sm",
  outline: "border-2 border-gray-300 bg-white/80 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm hover:shadow-md border-gray-200 hover:border-gray-300",
  destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl",
};

const buttonSizes = {
  default: "px-6 py-3",
  sm: "px-4 py-2 text-sm",
  lg: "px-8 py-4 text-lg",
  icon: "h-10 w-10 p-0",
};

export function Button({ 
  variant = "default", 
  size = "default", 
  className = "", 
  asChild = false, 
  children, 
  ...rest 
}) {
  const variantClasses = buttonVariants[variant] || buttonVariants.default;
  const sizeClasses = buttonSizes[size] || buttonSizes.default;
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95";
  
  const combinedClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { 
      className: combinedClassName, 
      ...rest 
    });
  }
  
  return (
    <button className={combinedClassName} {...rest}>
      {children}
    </button>
  );
}