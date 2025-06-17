// src/components/ui/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = "blue", trend, trendValue }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: "bg-blue-400/20",
      trend: "text-blue-100"
    },
    green: {
      bg: "bg-gradient-to-br from-green-500 to-green-600", 
      icon: "bg-green-400/20",
      trend: "text-green-100"
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      icon: "bg-yellow-400/20", 
      trend: "text-yellow-100"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: "bg-purple-400/20",
      trend: "text-purple-100"
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      icon: "bg-red-400/20",
      trend: "text-red-100"
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      icon: "bg-indigo-400/20",
      trend: "text-indigo-100"
    }
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${classes.bg} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-xs ${classes.trend}`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 ${classes.icon} rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
