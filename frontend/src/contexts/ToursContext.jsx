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

  // API base URLs - Spring Boot backend on 8080, React on 5173
  const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : '/api';
  const TOURS_API = `${API_BASE}/tours`;

  // Fetch all upcoming tours
  const fetchUpcomingTours = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      console.log('🔄 Fetching tours from:', `${TOURS_API}?status=Upcoming`);
      console.log('🔐 Using token:', token ? 'Yes' : 'No');
      console.log('📡 Making request to:', `${TOURS_API}?status=Upcoming`);
      
      const response = await fetch(`${TOURS_API}?status=Upcoming`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('✅ Tours API response status:', response.status);
      console.log('✅ Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tours API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Tours API data:', data);
        const toursArray = Array.isArray(data) ? data : data.tours || [];
        setTours(toursArray);
        return { success: true, data: toursArray };
      } else {
        // Get response as text to debug
        const responseText = await response.text();
        console.log('Non-JSON response from tours API:', responseText);
        
        if (!responseText.trim()) {
          console.log('Empty response from tours API');
          setTours([]);
          return { success: true, data: [] };
        }

        try {
          const data = JSON.parse(responseText);
          console.log('Parsed tours data:', data);
          const toursArray = Array.isArray(data) ? data : data.tours || [];
          setTours(toursArray);
          return { success: true, data: toursArray };
        } catch (parseError) {
          console.error('JSON parse error in tours:', parseError);
          console.error('Response was:', responseText);
          throw new Error('Invalid JSON response from tours API');
        }
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      
      // Handle specific error types with retry logic
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timed out. The server may be slow or unavailable.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } else if (err.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') || 
                 err.message.includes('Failed to fetch') ||
                 err.message.includes('NetworkError')) {
        console.error('Network/encoding error:', err.message);
        
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Retrying tours request in ${delay}ms (${retryCount + 1}/3)...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchUpcomingTours(retryCount + 1);
        } else {
          const errorMsg = 'Unable to connect to server after multiple attempts. Please check your connection and try again.';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } else {
        setError(err.message);
        return { success: false, error: err.message };
      }
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
