import React from 'react';

export const RadioGroup = React.forwardRef(({ className = "", children, value, onValueChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`grid gap-2 ${className}`}
      role="radiogroup"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name: props.name,
            checked: child.props.value === value,
            onChange: () => onValueChange?.(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
});

export const RadioGroupItem = React.forwardRef(({ className = "", value, checked, onChange, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      className={`aspect-square h-4 w-4 rounded-full border border-blue-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      value={value}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  );
});

RadioGroup.displayName = "RadioGroup";
RadioGroupItem.displayName = "RadioGroupItem";
