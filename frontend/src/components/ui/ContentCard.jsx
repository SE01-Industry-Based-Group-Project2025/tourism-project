// src/components/ui/ContentCard.jsx
import React from 'react';

const ContentCard = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

export default ContentCard;
