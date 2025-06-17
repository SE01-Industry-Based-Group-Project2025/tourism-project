// src/components/ui/PageHeader.jsx
import React from 'react';

const PageHeader = ({ title, subtitle, icon: Icon, iconColor = "text-blue-600", iconBgColor = "bg-blue-100" }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        {Icon && (
          <div className="flex items-center gap-3">
            <div className={`p-3 ${iconBgColor} rounded-full`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
