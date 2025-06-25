import React from 'react';

export const Label = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`block text-sm font-medium text-gray-700 mb-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";
