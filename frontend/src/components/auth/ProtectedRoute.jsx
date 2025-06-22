import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({
  children,
  requiredRole = null,
  redirectTo = '/login'
}) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hasCheckedAuth = useRef(false);

  // Security: Comprehensive protection against unauthorized access
  useEffect(() => {
    const handleUnauthorizedAccess = () => {
      // Clear all browser history to prevent back-button access
      window.history.replaceState(null, '', '/login');
      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      // Force navigation to login
      navigate('/login', { replace: true });
    };

    if (!loading) {
      if (!isAuthenticated) {
        handleUnauthorizedAccess();
      } else {
        // Mark that we've verified authentication
        hasCheckedAuth.current = true;
      }
    }
  }, [loading, isAuthenticated, navigate]);
  // Security: Monitor browser navigation events
  useEffect(() => {
    const handlePopState = (event) => {
      // If user tries to navigate back and they're not authenticated, redirect to login
      if (!loading && !isAuthenticated) {
        event.preventDefault();
        event.stopPropagation();
        // Immediately replace history state
        window.history.replaceState(null, '', '/login');
        // Force immediate redirect
        window.location.replace('/login');
        return false;
      }
    };

    const handleBeforeUnload = (event) => {
      // Clear sensitive data before page unload
      if (!isAuthenticated) {
        localStorage.clear();
        sessionStorage.clear();
        // Also clear any cached responses
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
      }
    };

    const handlePageShow = (event) => {
      // Handle back/forward cache (bfcache) - when page is restored from cache
      if (event.persisted && !loading && !isAuthenticated) {
        window.location.replace('/login');
      }
    };

    // Add event listeners for browser navigation
    window.addEventListener('popstate', handlePopState, true);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('popstate', handlePopState, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [loading, isAuthenticated, navigate]);
  // Security: Real-time auth verification with immediate enforcement
  useEffect(() => {
    if (hasCheckedAuth.current && !loading && !isAuthenticated) {
      // User was authenticated but now isn't - force logout immediately
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      // Prevent any form of navigation back to protected content
      window.history.replaceState(null, '', '/login');
      
      // Use replace instead of navigate to prevent history manipulation
      window.location.replace('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Additional security: Check authentication on every render cycle
  useEffect(() => {
    let authCheckInterval;
    
    if (!loading && isAuthenticated) {
      // Continuously verify auth state every 5 seconds
      authCheckInterval = setInterval(() => {
        const token = localStorage.getItem('token');
        if (!token || !isAuthenticated) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.replace('/login');
        }
      }, 5000);
    }

    return () => {
      if (authCheckInterval) {
        clearInterval(authCheckInterval);
      }
    };
  }, [isAuthenticated, loading]);

  // 1. Show spinner while verifying auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // 2. Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
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
