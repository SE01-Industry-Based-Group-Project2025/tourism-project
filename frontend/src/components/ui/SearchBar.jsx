// src/components/ui/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchTerm, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search destinations and activities..."
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 pr-12 py-3.5 border-0 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-xl transition-all duration-200 placeholder-gray-500 text-gray-900 font-medium"
      />
      {searchTerm && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <div className="p-1.5 hover:bg-red-50 rounded-lg transition-colors duration-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
