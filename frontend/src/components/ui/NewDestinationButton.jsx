// src/components/ui/NewDestinationButton.jsx
import React from 'react';

const NewDestinationButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 backdrop-blur-sm transform hover:-translate-y-0.5"
    >
      <div className="p-1 bg-white/20 rounded-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      {children}
    </button>
  );
};

export default NewDestinationButton;
