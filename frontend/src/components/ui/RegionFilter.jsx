// src/components/ui/RegionFilter.jsx
import React from 'react';

const RegionFilter = ({ selectedRegion, onChange }) => {
  const regions = ['All Regions', 'North', 'South', 'East', 'West'];

  return (
    <select
      value={selectedRegion}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {regions.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
};

export default RegionFilter;
