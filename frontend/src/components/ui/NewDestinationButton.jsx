// src/components/ui/NewDestinationButton.jsx
import React from 'react';

const NewDestinationButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 float-right"
    >
      {children}
    </button>
  );
};

export default NewDestinationButton;
