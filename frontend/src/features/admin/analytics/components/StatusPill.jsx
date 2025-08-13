// src/features/admin/analytics/components/StatusPill.jsx
import React from 'react';

const StatusPill = ({ value, size = 'sm' }) => {
  const getStatusStyles = (status) => {
    const normalizedStatus = status?.toUpperCase();
    
    switch (normalizedStatus) {
      case 'UP':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DOWN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'STABLE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'BRONZE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SILVER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PLATINUM':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border ${getStatusStyles(value)} ${sizeClasses}`}
    >
      {value || '—'}
    </span>
  );
};

export default StatusPill;
