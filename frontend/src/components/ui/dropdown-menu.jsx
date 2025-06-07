// src/components/ui/dropdown-menu.jsx
import React, { useState, useRef, useEffect, createContext, useContext } from "react";

const DropdownContext = createContext();

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild = false, children }) {
  const { setIsOpen } = useContext(DropdownContext);
  
  const handleClick = () => {
    setIsOpen(prev => !prev);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { 
      onClick: handleClick,
      "aria-haspopup": "true",
      "aria-expanded": useContext(DropdownContext).isOpen,
    });
  }
  
  return (
    <button onClick={handleClick} aria-haspopup="true" aria-expanded={useContext(DropdownContext).isOpen}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ align = "start", className = "", children }) {
  const { isOpen } = useContext(DropdownContext);
  
  if (!isOpen) return null;
  
  return (
    <div
      className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-0 zoom-in-95 ${
        align === "end" ? "right-0" : "left-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ className = "", children }) {
  return (
    <div className={`px-3 py-2 text-sm font-semibold text-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = "" }) {
  return <div className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} />;
}

export function DropdownMenuItem({ className = "", onClick, children }) {
  const { setIsOpen } = useContext(DropdownContext);
  
  const handleClick = (e) => {
    onClick?.(e);
    setIsOpen(false);
  };
  
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}