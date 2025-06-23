import React, { useState, useRef, useEffect } from 'react';

export const Popover = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const PopoverTrigger = ({ children, asChild, ...props }) => {
  return React.cloneElement(children, props);
};

export const PopoverContent = ({ children, className = "", align = "center", sideOffset = 4 }) => {
  return (
    <div className={`absolute z-50 w-72 rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-lg outline-none ${className}`}>
      {children}
    </div>
  );
};
