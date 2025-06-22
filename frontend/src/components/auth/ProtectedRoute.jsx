import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({
  children,
  requiredRole = null,
  redirectTo = '/login'
}) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Security: Clear browser history on unauthenticated access
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Clear browser navigation history to prevent back-button access
      window.history.replaceState(null, '', '/login');
    }
  }, [loading, isAuthenticated]);

  // 1. Show spinner while verifying auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3. If a specific role is required, check it
  if (requiredRole) {
    // Additional security: Check if user object exists and has roles
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return <Navigate to="/login" replace />;
    }

    const hasRole =
      requiredRole === 'ROLE_ADMIN' ? isAdmin : user.roles.includes(requiredRole);

    if (!hasRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
  }

  // 4. All good—render children
  return children;
}
