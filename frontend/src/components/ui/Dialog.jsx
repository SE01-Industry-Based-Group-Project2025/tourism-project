import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { onOpenChange });
            }
            return child;
          })}
        </div>
      )}
    </>
  );
};

export const DialogTrigger = ({ children, ...props }) => {
  return React.cloneElement(children, props);
};

export const DialogContent = ({ children, onOpenChange, className = "" }) => {
  const isFullScreen = className.includes('max-w-none');
  
  return (
    <div className={`${isFullScreen 
      ? 'fixed inset-0 z-50 bg-white overflow-auto' 
      : 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg rounded-lg'
    } ${className}`}>
      {children}
      {!isFullScreen && (
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onOpenChange?.(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
};

export const DialogHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

export const DialogFooter = ({ children, className = "" }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

export const DialogDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

export const DialogClose = ({ children, asChild, ...props }) => {
  return React.cloneElement(children, props);
};
