import React from 'react';

export function Input({ className = "", ...props }) {
    return (
        <input
            className={`border-0 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-xl transition-all duration-200 placeholder-gray-500 text-gray-900 font-medium shadow-lg hover:shadow-xl ${className}`}
            {...props}
        />
    );
}