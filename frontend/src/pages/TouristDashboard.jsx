// src/pages/TouristDashboard.jsx

import React from 'react';
import { useAuth }    from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function TouristDashboard() {
  const { user, logout } = useAuth();
  const { state }        = useLocation();
  const banner           = state?.loginMsg;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-emerald-700 to-teal-600 text-white">
      {banner && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
          {banner}
        </div>
      )}
      <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
      {/* …rest of tourist UI… */}
    </div>
  );
}
