// src/features/admin/analytics/components/MiniCards.jsx
import React from 'react';
import StatusPill from './StatusPill';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MiniCard = ({ title, value, subtext, trend, icon: Icon, loading = false }) => {
  const getTrendIcon = () => {
    switch (trend?.toUpperCase()) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'STABLE':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value || '—'}
          </div>
          {subtext && (
            <div className="text-sm text-gray-600">
              {subtext}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <StatusPill value={trend} size="xs" />
          </div>
        )}
      </div>
    </div>
  );
};

const MiniCards = ({ cards, loading = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <MiniCard 
          key={card.title || index} 
          {...card}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default MiniCards;
export { MiniCard };
