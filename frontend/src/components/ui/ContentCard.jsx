// src/components/ui/ContentCard.jsx
import React from 'react';

const ContentCard = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

export default ContentCard;
