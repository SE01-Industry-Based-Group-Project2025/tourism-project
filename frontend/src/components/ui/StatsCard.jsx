// src/components/ui/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {  const colorClasses = {
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

  const classes = colorClasses[color] || colorClasses.blue;  return (
    <div className={`${classes.bg} text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        {Icon && (
          <div className={`p-4 ${classes.icon} rounded-2xl backdrop-blur-sm`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
