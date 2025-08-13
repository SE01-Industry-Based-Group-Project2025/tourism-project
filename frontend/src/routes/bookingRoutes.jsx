// src/routes/bookingRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import BookingSuccess from '../features/booking/BookingSuccess';
import BookingCancel from '../features/booking/BookingCancel';
import MyBookings from '../features/booking/MyBookings';

// Export individual routes to be used in App.jsx
export const bookingRoutes = (
  <>
    <Route path="/booking-success" element={<BookingSuccess />} />
    <Route path="/booking-cancel" element={<BookingCancel />} />
    <Route 
      path="/my-bookings" 
      element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } 
    />
  </>
);
