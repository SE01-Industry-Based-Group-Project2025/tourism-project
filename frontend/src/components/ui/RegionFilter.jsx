// src/components/ui/RegionFilter.jsx
import React from 'react';

const RegionFilter = ({ selectedRegion, onChange }) => {
  const regions = [
    'All Regions', 
    'Hill Country', 
    'Southern', 
    'Central', 
    'Eastern',
    'Northern',
    'Western',
    'North Central',
    'North Western',
    'Sabaragamuwa',
    'Uva'
  ];

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <div className="p-1.5 bg-green-100 rounded-lg">
          <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
      </div>
      <select
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto pl-14 pr-12 py-3.5 border-0 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:shadow-xl transition-all duration-200 appearance-none cursor-pointer text-gray-900 font-medium"
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <div className="p-1.5 bg-gray-100 rounded-lg">
          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RegionFilter;
