// src/components/ui/PageHeader.jsx
import React from 'react';

const PageHeader = ({ title, subtitle, icon: Icon, iconColor = "text-blue-600", iconBgColor = "bg-blue-100", action }) => {
  return (
    <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-4 ${iconBgColor} rounded-xl shadow-sm`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600 text-lg">{subtitle}</p>
          </div>
        </div>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
