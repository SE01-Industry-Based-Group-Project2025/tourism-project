// src/components/ui/ContentCard.jsx
import React from 'react';

const ContentCard = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

export default ContentCard;
