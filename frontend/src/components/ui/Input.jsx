import React from 'react';

export function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full border border-gray-200 bg-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 text-sm ${className}`}
            {...props}
        />
    );
}