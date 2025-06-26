// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useSecurityMonitor } from "./hooks/useSecurityMonitor";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts & Pages
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Tours from "./pages/Tours";
import AddTour from "./pages/AddTour";
import Places from "./pages/Places";
import Users from "./pages/Users";
import QuoteRequests from "./pages/QuoteRequests";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import LandingPage from "./pages/LandingPage";

// Auth
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TouristDashboard from './pages/TouristDashboard';

export default function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Security monitoring hook
  useSecurityMonitor();  // Security: Monitor authentication state changes with enhanced protection
  useEffect(() => {
    const handleAuthChange = () => {
      const currentPath = window.location.pathname;
      
      // Only redirect if user becomes unauthenticated and is on a protected route
      // Don't redirect if they're on public routes like /, /login, /register
      if (!isAuthenticated && currentPath.startsWith('/admin')) {
        // Clear all possible caches and storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear browser cache
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        
        // Clear navigation history and force redirect
        window.history.replaceState(null, '', '/login');
        window.location.replace('/login');
      }
    };

    // Run immediately
    handleAuthChange();
    
    // Also run on any route change
    const handlePopState = () => {
      setTimeout(handleAuthChange, 0);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, navigate]);

  // Additional security: Prevent access via direct URL manipulation
  useEffect(() => {
    const handleRouteProtection = () => {
      const currentPath = window.location.pathname;
      
      // Check if trying to access admin routes without authentication
      if (currentPath.startsWith('/admin') && !isAuthenticated) {
        window.location.replace('/login');
      }
    };

    // Set up a recurring check
    const protectionInterval = setInterval(handleRouteProtection, 1000);
    
    return () => {
      clearInterval(protectionInterval);
    };
  }, [isAuthenticated]);
  return (
    <>
      <Routes>
        {/* Public landing page - should be first */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tourist (any logged‐in user) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TouristDashboard />
              </ProtectedRoute>
            }
          />

        {/* Admin-only routes */}
        <Route
          path="/admin/*"        element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/new" element={<AddTour />} />
          <Route path="places" element={<Places />} />
          <Route path="users" element={<Users />} />
          <Route path="quote-requests" element={<QuoteRequests />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>      {/* Fallback: if someone tries anything else */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
