// src/pages/AddTour.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddNewTour from '../components/tours/AddNewTour';

export default function AddTour() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're in template mode based on the route
  const isTemplateMode = location.pathname.includes('/templates');
  
  // Get URL search params AND router state
  const searchParams = new URLSearchParams(location.search);
  const fromTemplateId = searchParams.get('fromTemplate') || location.state?.templateId;
  const isFromTemplate = !!fromTemplateId || location.state?.fromTemplate;

  console.log('🔍 AddTour Debug:', { 
    pathname: location.pathname, 
    search: location.search, 
    fromTemplateId,
    isTemplateMode,
    locationState: location.state,
    isFromTemplate
  });

  const handleClose = () => {
    if (isTemplateMode) {
      navigate('/admin/templates');
    } else {
      navigate('/admin/tours');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="w-full p-6">
        {/* Add New Tour Component - Full Width with Enhanced Styling */}
        <AddNewTour 
          onClose={handleClose} 
          isTemplate={isTemplateMode} 
          fromTemplateId={fromTemplateId}
        />
      </div>
    </div>
  );
}
