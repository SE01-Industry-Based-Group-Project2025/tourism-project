// src/App.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts & Pages
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Tours from "./pages/Tours";
import Places from "./pages/Places";
import Users from "./pages/Users";
import QuoteRequests from "./pages/QuoteRequests";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import LandingPage      from "./pages/LandingPage";

// Auth
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TouristDashboard from './pages/TouristDashboard';

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public landing page */}
       <Route path="/" element={<LandingPage />} />

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
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="tours" element={<Tours />} />
        <Route path="places" element={<Places />} />
        <Route path="users" element={<Users />} />
        <Route path="quote-requests" element={<QuoteRequests />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Fallback: if someone tries anything else */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
