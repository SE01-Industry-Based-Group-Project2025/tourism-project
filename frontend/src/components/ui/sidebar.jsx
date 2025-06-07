// src/components/ui/sidebar.jsx

import React from "react";

/** Sidebar Root */
export function Sidebar({ className = "", children, ...rest }) {
  return (
    <nav className={className} {...rest}>
      {children}
    </nav>
  );
}

/** SidebarHeader */
export function SidebarHeader({ className = "", children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

/** SidebarContent */
export function SidebarContent({ className = "", children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

/** SidebarFooter */
export function SidebarFooter({ className = "", children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

/** SidebarMenu: reset default list styling */
export function SidebarMenu({ className = "", children, ...rest }) {
  return (
    <ul className={`list-none p-0 m-0 gap-4 ${className}`} {...rest}>
      {children}
    </ul>
  );
}

/** SidebarMenuItem: reset potential li styling as well */
export function SidebarMenuItem({ className = "", children, ...rest }) {
  return (
    <li className={`list-none p-0 m-0 ${className}`} {...rest}>
      {children}
    </li>
  );
}

/**
 * SidebarMenuButton: clickable element inside a SidebarMenuItem
 * - asChild: if true, clones the child and merges props/className
 */
export function SidebarMenuButton({ asChild = false, className = "", children, ...rest }) {
  if (asChild && React.isValidElement(children)) {
    // Merge classNames properly instead of overriding
    const childClassName = children.props.className || "";
    const mergedClassName = className ? `${childClassName} ${className}` : childClassName;
    
    return React.cloneElement(children, { 
      ...children.props,  // Preserve child's original props
      ...rest,            // Apply new props
      className: mergedClassName  // Merge classNames
    });
  }
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}