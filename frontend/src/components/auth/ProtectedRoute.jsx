import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole = null, redirectTo = '/login' }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'ROLE_ADMIN' && !isAdmin) {
      return <Navigate to={redirectTo} replace />;
    }
    if (!user?.roles?.includes(requiredRole)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}
