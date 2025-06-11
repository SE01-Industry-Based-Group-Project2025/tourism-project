import React from "react";

export function Card({ className = "", children, ...rest}) {
    return (
        <div className={`bg-white rounded-lg ${className}`} {...rest}>
            {children}
        </div>
    );
}

export function CardHeader({ className = "", children, ...rest }) {
    return (
        <div className={`border-b border-gray-200 ${className}`} {...rest}>
            {children}
        </div>
    );
}

export function CardContent({ className = "", children, ...rest }) {
    return (
        <div className={className} {...rest}>
            {children}
        </div>
    );
}

export function CardTitle({ className = "", children, ...rest }) {
    return (
        <h2 className={`text-lg font-semibold ${className}`} {...rest}>
            {children}
        </h2>
    );
}