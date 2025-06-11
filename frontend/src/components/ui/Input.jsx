import React from 'react';

export function Input({ className = "", ...props }) {
    return (
        <input
            className={`border border-gray-300 bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            {...props}
        />
    );
}