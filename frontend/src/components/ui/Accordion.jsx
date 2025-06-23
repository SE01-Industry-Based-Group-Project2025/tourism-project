import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ 
  children, 
  type = "single", 
  collapsible = false, 
  className = "",
  value: controlledValue,
  onValueChange
}) => {
  const [internalOpenItems, setInternalOpenItems] = useState(new Set());
    // Use controlled state if provided, otherwise use internal state
  const openItems = controlledValue !== undefined 
    ? new Set(controlledValue ? [controlledValue] : [])
    : internalOpenItems;
  const toggleItem = (value) => {
    if (controlledValue !== undefined) {
      // Controlled mode
      if (type === "single") {
        const newValue = openItems.has(value) ? null : value;
        onValueChange?.(newValue);
      } else {
        const newSet = new Set(openItems);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        onValueChange?.(Array.from(newSet));
      }
    } else {
      // Uncontrolled mode
      if (type === "single") {
        setInternalOpenItems(prev => {
          const newSet = new Set();
          if (!prev.has(value)) {
            newSet.add(value);
          }
          return newSet;
        });
      } else {
        setInternalOpenItems(prev => {
          const newSet = new Set(prev);
          if (newSet.has(value)) {
            newSet.delete(value);
          } else {
            newSet.add(value);
          }
          return newSet;
        });
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen: openItems.has(child.props.value),
            onToggle: () => toggleItem(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionItem = ({ children, value, isOpen, onToggle, className = "" }) => {
  return (
    <div className={`border-b border-stone-200 ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, onToggle, value });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger = ({ children, isOpen, onToggle, className = "" }) => {
  return (
    <button
      className={`flex w-full items-center justify-between py-4 font-medium text-left transition-all hover:text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-md ${className}`}
      onClick={onToggle}
    >
      {children}
      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 text-rose-700 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

export const AccordionContent = ({ children, isOpen, className = "" }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div 
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: `${height}px` }}
    >
      <div ref={contentRef} className={`pb-4 pt-0 ${className}`}>
        {children}
      </div>
    </div>
  );
};
