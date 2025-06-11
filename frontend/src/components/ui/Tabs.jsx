// src/components/ui/Tabs.jsx
import React from 'react';


const Tabs = ({ activeTab, onChange }) => {
  const tabs = ['Destinations', 'Activities'];

  return (
    <div className="flex border-b border-gray-300 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-6 py-2 font-medium border-b-2 transition duration-150 ${
            activeTab === tab
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
