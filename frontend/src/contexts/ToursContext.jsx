// src/contexts/ToursContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ToursContext = createContext();

export const useTours = () => {
  const ctx = useContext(ToursContext);
  if (!ctx) throw new Error('useTours must be used within ToursProvider');
  return ctx;
};

export const ToursProvider = ({ children }) => {
  const { token } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URLs - using proxy for development
  const API_BASE = '/api';
  const TOURS_API = `${API_BASE}/tours`;

  // Fetch all upcoming tours
  const fetchUpcomingTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${TOURS_API}?status=Upcoming`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTours(Array.isArray(data) ? data : data.tours || []);
      return { success: true, data: Array.isArray(data) ? data : data.tours || [] };
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single tour by ID
  const fetchTourById = async (tourId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${TOURS_API}/${tourId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching tour details:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Search tours with filters
  const searchTours = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      
      // Add status filter for upcoming tours
      queryParams.append('status', 'Upcoming');
      
      // Add other filters
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.duration) queryParams.append('duration', filters.duration);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await fetch(`${TOURS_API}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const toursData = Array.isArray(data) ? data : data.tours || [];
      setTours(toursData);
      return { success: true, data: toursData };
    } catch (err) {
      console.error('Error searching tours:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tours,
    loading,
    error,
    fetchUpcomingTours,
    fetchTourById,
    searchTours,
    setTours,
    setError
  };

  return (
    <ToursContext.Provider value={value}>
      {children}
    </ToursContext.Provider>
  );
};
