// src/pages/AddTour.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddNewTour from '../components/tours/AddNewTour';

export default function AddTour() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/admin/tours');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="w-full p-6">
        {/* Add New Tour Component - Full Width with Enhanced Styling */}
        <AddNewTour onClose={handleClose} />
      </div>
    </div>
  );
}
