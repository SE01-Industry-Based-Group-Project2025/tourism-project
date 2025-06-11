// src/components/ui/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchTerm, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search destinations..."
      value={searchTerm}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    />
  );
};

export default SearchBar;
