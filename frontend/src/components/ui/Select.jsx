import React from 'react';

export function Select({ className = "", children, value, onChange, ...rest }) {
    return (
        <select 
            className={`border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            value={value}
            onChange={onChange}
            {...rest}
        >
            {children}
        </select>
    );
}

export function SelectTrigger({ className = "", children, ...rest }) {
    return (
        <div className={className} {...rest}>
            {children}
        </div>
    );
}

export function SelectValue({placeholder}) {
    return null; // This component is not needed for basic select
}

export function SelectContent({ className = "", children, ...rest }) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}

export function SelectItem({ value, children, ...rest }) {
    return (
        <option value={value} {...rest}>
            {children}
        </option>
    );
}