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

// Auth
import Login from "./components/auth/Login";
//import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect root to login (or to admin/dashboard if you prefer) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

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
        <Route path="dashboard" element={<Dashboard />} />
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
