// src/components/ui/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = "blue", percentage = "" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
      icon: "bg-blue-400/30"
    },
    green: {
      bg: "bg-gradient-to-br from-green-500 via-green-600 to-green-700", 
      icon: "bg-green-400/30"
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700",
      icon: "bg-yellow-400/30"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700",
      icon: "bg-purple-400/30"
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
      icon: "bg-red-400/30"
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700",
      icon: "bg-indigo-400/30"
    },
    pink: {
      bg: "bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700",
      icon: "bg-pink-400/30"
    }
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${classes.bg} text-white p-6 lg:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 min-h-[160px] relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
      
      <div className="relative z-10 flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 pr-4 flex flex-col justify-between h-full">
          <p className="text-white/90 text-sm font-semibold mb-4 uppercase tracking-wide leading-tight truncate whitespace-nowrap overflow-hidden" title={title}>
            {title}
          </p>
          <div>
            <p className="text-3xl lg:text-4xl font-bold leading-none truncate whitespace-nowrap overflow-hidden mb-2" title={value}>
              {value}
            </p>
            {percentage && (
              <p className="text-white/80 text-sm font-medium">
                {percentage}
              </p>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 lg:p-4 ${classes.icon} rounded-2xl backdrop-blur-sm flex-shrink-0`}>
            <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
