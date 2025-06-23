import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = React.forwardRef(({ className = "", checked, onCheckedChange, ...props }, ref) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <div className={`h-4 w-4 shrink-0 rounded-sm border border-blue-600 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-blue-600 text-white' : 'bg-white'} ${className}`}>
        {checked && (
          <Check className="h-4 w-4 text-white" />
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = "Checkbox";
