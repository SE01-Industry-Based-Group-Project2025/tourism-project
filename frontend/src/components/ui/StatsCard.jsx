// src/components/ui/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: "bg-blue-400/20"
    },
    green: {
      bg: "bg-gradient-to-br from-green-500 to-green-600", 
      icon: "bg-green-400/20"
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      icon: "bg-yellow-400/20"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: "bg-purple-400/20"
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      icon: "bg-red-400/20"
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      icon: "bg-indigo-400/20"
    }
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${classes.bg} text-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]`}>
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 pr-3 sm:pr-4 flex flex-col justify-between h-full">
          <p className="text-white/90 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wide leading-tight truncate whitespace-nowrap overflow-hidden" title={title}>
            {title}
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-none truncate whitespace-nowrap overflow-hidden" title={value}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-2 sm:p-3 lg:p-4 ${classes.icon} rounded-xl sm:rounded-2xl backdrop-blur-sm flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
