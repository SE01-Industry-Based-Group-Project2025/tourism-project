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
      
      // Add filter to exclude templates for tourists
      const queryParams = new URLSearchParams({
        status: 'Upcoming',
        isTemplate: 'false' // Exclude templates from tourist view
      });
      
      console.log('🔄 Fetching tours from:', `${TOURS_API}?${queryParams.toString()}`);
      console.log('🔐 Using token:', token ? 'Yes' : 'No');
      console.log('📡 Making request to:', `${TOURS_API}?${queryParams.toString()}`);
      
      const response = await fetch(`${TOURS_API}?${queryParams.toString()}`, {
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

  // Fetch single tour by ID with full details including itinerary
  const fetchTourById = async (tourId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching tour details for ID:', tourId);
      console.log('🔐 Using token:', token ? 'Yes' : 'No');
      
      // For tourists, we'll try a public endpoint first if the secure one fails
      const endpoints = [
        `${TOURS_API}/${tourId}`,
        `${TOURS_API}/public/${tourId}`,
        `${API_BASE}/public/tours/${tourId}`
      ];
      
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log('🔄 Trying endpoint:', endpoint);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            }
          });

          console.log('✅ Tour details API response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('📋 Tour details data:', data);
            
            // Check if this is a template and user is not admin
            if (data.isTemplate || data.is_template) {
              throw new Error('This tour is not available for viewing');
            }
            
            return { success: true, data };
          } else {
            if (response.status === 401) {
              lastError = new Error('You need to be logged in to view tour details');
            } else if (response.status === 403) {
              lastError = new Error('This tour is not available for viewing');
            } else if (response.status === 404) {
              lastError = new Error('Tour not found');
            } else {
              lastError = new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`❌ Endpoint ${endpoint} failed:`, lastError.message);
            continue; // Try next endpoint
          }
        } catch (endpointError) {
          console.log(`❌ Endpoint ${endpoint} error:`, endpointError.message);
          lastError = endpointError;
          continue; // Try next endpoint
        }
      }
      
      // If all endpoints failed, throw the last error
      throw lastError || new Error('All tour endpoints failed');
      
    } catch (err) {
      console.error('Error fetching tour details:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Add a new function to fetch tour with itinerary details specifically
  const fetchTourWithItinerary = async (tourId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching tour with itinerary for ID:', tourId);
      
      // First try the basic tour endpoint which should work for tourists
      console.log('🔄 Trying basic tour endpoint first...');
      const basicResponse = await fetch(`${TOURS_API}/${tourId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (basicResponse.ok) {
        const data = await basicResponse.json();
        console.log('📋 Basic tour data:', data);
        
        // Check if this is a template
        if (data.isTemplate || data.is_template) {
          throw new Error('This tour is not available for viewing');
        }
        
        // Try to get itinerary details separately
        try {
          console.log('🔄 Trying to get itinerary details...');
          const itineraryResponse = await fetch(`${TOURS_API}/${tourId}/itinerary`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            }
          });

          if (itineraryResponse.ok) {
            const itineraryData = await itineraryResponse.json();
            console.log('📋 Itinerary data:', itineraryData);
            
            // Combine tour data with itinerary
            const combinedData = {
              ...data,
              itineraryDays: itineraryData.itineraryDays || itineraryData || [],
              // Also try to get additional details like activities, places, etc.
              activities: itineraryData.activities || data.activities || [],
              places: itineraryData.places || data.places || [],
              meals: itineraryData.meals || data.meals || []
            };
            
            return { success: true, data: combinedData };
          } else {
            console.log('ℹ️ Itinerary endpoint not accessible, using basic data');
          }
        } catch (itineraryError) {
          console.log('ℹ️ Itinerary endpoint failed:', itineraryError.message);
        }
        
        // Try alternative detailed endpoint patterns
        const detailEndpoints = [
          `${TOURS_API}/${tourId}/details`,
          `${TOURS_API}/${tourId}/full`,
          `${API_BASE}/tours/${tourId}/complete`
        ];
        
        for (const endpoint of detailEndpoints) {
          try {
            console.log('🔄 Trying details endpoint:', endpoint);
            const detailsResponse = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
              }
            });

            if (detailsResponse.ok) {
              const detailedData = await detailsResponse.json();
              console.log('📋 Detailed tour data from', endpoint, ':', detailedData);
              return { success: true, data: detailedData };
            }
          } catch (detailError) {
            console.log(`❌ Details endpoint ${endpoint} failed:`, detailError.message);
            continue;
          }
        }
        
        // If no detailed endpoints work, return basic data
        return { success: true, data: data };
      }

      // If basic endpoint also fails, handle the error
      if (basicResponse.status === 401) {
        throw new Error('You need to be logged in to view tour details');
      } else if (basicResponse.status === 403) {
        throw new Error('This tour is not available for viewing');
      } else if (basicResponse.status === 404) {
        throw new Error('Tour not found');
      }
      
      throw new Error(`HTTP error! status: ${basicResponse.status}`);
      
    } catch (err) {
      console.error('Error fetching tour with itinerary:', err);
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
      
      // Exclude templates from tourist view
      queryParams.append('isTemplate', 'false');
      
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

  // New function to fetch complete tour data including all relationships
  const fetchCompleteTourData = async (tourId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching complete tour data for ID:', tourId);
      
      // Try multiple approaches to get all tour data
      const dataRequests = [];
      
      // 1. Basic tour data
      dataRequests.push(
        fetch(`${TOURS_API}/${tourId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }).then(res => res.ok ? res.json().then(data => ({ type: 'tour', data })) : null)
      );
      
      // 2. Itinerary data
      dataRequests.push(
        fetch(`${TOURS_API}/${tourId}/itinerary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }).then(res => res.ok ? res.json().then(data => ({ type: 'itinerary', data })) : null)
      );
      
      // 3. Activities data
      dataRequests.push(
        fetch(`${TOURS_API}/${tourId}/activities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }).then(res => res.ok ? res.json().then(data => ({ type: 'activities', data })) : null)
      );
      
      // 4. Places data
      dataRequests.push(
        fetch(`${TOURS_API}/${tourId}/places`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }).then(res => res.ok ? res.json().then(data => ({ type: 'places', data })) : null)
      );

      // Execute all requests in parallel
      const results = await Promise.allSettled(dataRequests);
      
      // Combine all successful results
      let combinedData = { id: tourId };
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const { type, data } = result.value;
          
          switch (type) {
            case 'tour':
              combinedData = { ...combinedData, ...data };
              break;
            case 'itinerary':
              combinedData.itineraryDays = data.itineraryDays || data || [];
              break;
            case 'activities':
              combinedData.activities = data.activities || data || [];
              break;
            case 'places':
              combinedData.places = data.places || data || [];
              break;
          }
        }
      });
      
      // Check if we got at least basic tour data
      if (!combinedData.title && !combinedData.name) {
        throw new Error('Unable to fetch tour data');
      }
      
      // Check if this is a template
      if (combinedData.isTemplate || combinedData.is_template) {
        throw new Error('This tour is not available for viewing');
      }
      
      console.log('📋 Combined tour data:', combinedData);
      return { success: true, data: combinedData };
      
    } catch (err) {
      console.error('Error fetching complete tour data:', err);
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
    fetchTourWithItinerary,
    fetchCompleteTourData,
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
