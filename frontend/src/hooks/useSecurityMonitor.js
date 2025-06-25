// src/hooks/useSecurityMonitor.js
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const useSecurityMonitor = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect to login if trying to access protected routes while unauthenticated
    // Allow access to public routes: /, /login, /register
    const protectedRoutes = ['/admin', '/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    if (!isAuthenticated && isProtectedRoute) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return null;
};
