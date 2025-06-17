// src/components/ui/Tabs.jsx
import React from 'react';

const Tabs = ({ activeTab, onChange }) => {
  const tabs = [
    { 
      id: 'Destinations', 
      label: 'Destinations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'Activities', 
      label: 'Activities',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-1 flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
