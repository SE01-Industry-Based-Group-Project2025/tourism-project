// src/components/ui/button.jsx
import React from "react";

const buttonVariants = {
  default: "bg-[#0f4c81] text-white hover:bg-[#0d3d66]",
  ghost: "bg-transparent hover:bg-gray-100",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const buttonSizes = {
  default: "px-4 py-2",
  sm: "px-3 py-1.5 text-sm",
  lg: "px-6 py-3",
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
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
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