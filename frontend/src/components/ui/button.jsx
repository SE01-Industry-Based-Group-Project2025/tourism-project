// src/components/ui/button.jsx
import React from "react";

export function Button({ variant, size, className = "", asChild = false, children, ...rest }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className, ...rest });
  }
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
