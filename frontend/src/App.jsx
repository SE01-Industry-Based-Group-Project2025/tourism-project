// src/App.jsx

import React from "react";
import AdminLayout from "./components/layouts/AdminLayout";
import{Routes, Route, Navigate} from "react-router-dom";

//Placeholder page  component
import Dashboard from "./pages/Dashboard";
import Tours from "./pages/Tours";
import Places from "./pages/Places";
import Users from "./pages/Users";
import QuoteRequests from "./pages/QuoteRequests";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tours" element={<Tours />} />
        <Route path="places" element={<Places />} />
        <Route path="users" element={<Users />} />
        <Route path="quote-requests" element={<QuoteRequests />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
