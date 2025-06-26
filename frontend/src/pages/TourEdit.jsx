// src/pages/TourEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import ContentCard from '../components/ui/ContentCard';
import { ArrowLeft, Save, Eye } from 'lucide-react';

export default function TourEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders, token, user, isAuthenticated } = useAuth();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    durationValue: '',
    durationUnit: 'DAYS',
    availableSpots: '',
    category: 'ADVENTURE',
    region: 'WESTERN',
    difficulty: 'EASY',
    status: 'INCOMPLETE',
    activities: [],
    itinerary: []
  });

  const API_BASE = 'http://localhost:8080';
  const TOURS_API = `${API_BASE}/api/tours`;

  // Debug authentication
  useEffect(() => {
    console.log('TourEdit - Authentication Debug:');
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- user:', user);
    console.log('- token:', token);
    console.log('- getAuthHeaders():', getAuthHeaders());
  }, [isAuthenticated, user, token]);

  // Activities and places data
  const [availableActivities, setAvailableActivities] = useState([]);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching tour details for ID: ${id}`);
        console.log('getAuthHeaders() function:', getAuthHeaders);
        
        const authHeaders = getAuthHeaders();
        console.log('Auth headers for GET:', authHeaders);
        console.log('Token check for GET:', authHeaders.Authorization);
        
        const res = await fetch(`${TOURS_API}/${id}`, {
          method: 'GET',
          headers: authHeaders,
        });
        
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Raw tour data from backend:', JSON.stringify(data, null, 2));
          
          // Log each field individually to identify missing data
          console.log('Backend fields check:');
          console.log('- name:', data.name);
          console.log('- shortDescription:', data.shortDescription);
          console.log('- longDescription:', data.longDescription);
          console.log('- description:', data.description); // Sometimes backend uses 'description' instead
          console.log('- detailedDescription:', data.detailedDescription);
          console.log('- fullDescription:', data.fullDescription);
          console.log('- itinerary:', data.itinerary);
          console.log('- itineraryData:', data.itineraryData);
          console.log('- days:', data.days);
          console.log('- schedule:', data.schedule);
          console.log('- activities:', data.activities);
          
          setTour(data);
          
          // Enhanced form data population with fallback options for field name differences
          const populatedData = {
            name: data.name || '',
            shortDescription: data.shortDescription || data.description || '',
            longDescription: data.longDescription || data.detailedDescription || data.fullDescription || '',
            price: data.price?.toString() || '',
            durationValue: data.durationValue?.toString() || '',
            durationUnit: data.durationUnit || 'DAYS',
            availableSpots: data.availableSpots?.toString() || '',
            category: data.category || 'ADVENTURE',
            region: data.region || 'WESTERN',
            difficulty: data.difficulty || 'EASY',
            status: data.status || 'INCOMPLETE',
            activities: data.activities || [],
            // Handle different itinerary field names - AddNewTour sends 'itineraryDays'
            itinerary: data.itinerary || data.itineraryDays || data.days || data.schedule || []
          };
          
          console.log('Populated form data:', JSON.stringify(populatedData, null, 2));
          setFormData(populatedData);
        } else {
          const errorText = await res.text();
          console.error('Failed to fetch tour:', res.status, errorText);
          setError(`Failed to fetch tour details: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/activities/getAllActivity', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvailableActivities(data.map(activity => activity.name));
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/places/getAllPlace', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvailablePlaces(data.map(place => place.name));
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    if (id) {
      fetchTour();
      fetchActivities();
      fetchPlaces();
    }
  }, [id, getAuthHeaders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivityAdd = (activityName) => {
    if (activityName && !formData.activities.includes(activityName)) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activityName]
      }));
    }
  };

  const handleActivityRemove = (activityToRemove) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity !== activityToRemove)
    }));
  };

  const handleItineraryChange = (dayIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, {
        day: prev.itinerary.length + 1,
        title: '',
        description: '',
        places: []
      }]
    }));
  };

  const removeItineraryDay = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, index) => index !== dayIndex)
        .map((day, index) => ({ ...day, day: index + 1 }))
    }));
  };

  const handleItineraryPlaceAdd = (dayIndex, placeName) => {
    if (placeName && !formData.itinerary[dayIndex].places.includes(placeName)) {
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.map((day, index) => 
          index === dayIndex 
            ? { ...day, places: [...day.places, placeName] }
            : day
        )
      }));
    }
  };

  const handleItineraryPlaceRemove = (dayIndex, placeToRemove) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) => 
        index === dayIndex 
          ? { ...day, places: day.places.filter(place => place !== placeToRemove) }
          : day
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      // Prepare tour data in the format expected by the backend API
      // Use the same format as AddNewTour for consistency
      const tourData = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription, // Include this even if AddNewTour doesn't send it
        price: parseFloat(formData.price),
        durationValue: parseInt(formData.durationValue),
        durationUnit: formData.durationUnit.toUpperCase(),
        availableSpots: parseInt(formData.availableSpots),
        category: formData.category.toUpperCase(),
        region: formData.region.toUpperCase(),
        difficulty: formData.difficulty.toUpperCase(),
        status: formData.status.toUpperCase(),
        activities: formData.activities || [],
        // Send both field names to be safe
        itinerary: formData.itinerary || [],
        itineraryDays: formData.itinerary || [] // AddNewTour format
      };

      console.log('Updating tour with data:', tourData);
      console.log('getAuthHeaders() function:', getAuthHeaders);
      
      // Decode and log JWT token authorities for debugging
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', tokenPayload);
        console.log('User authorities:', tokenPayload.authorities?.map(auth => auth.authority));
        console.log('Looking for UPDATE_TOUR or EDIT_TOUR authority...');
        const hasUpdateAuth = tokenPayload.authorities?.some(auth => 
          auth.authority === 'UPDATE_TOUR' || 
          auth.authority === 'EDIT_TOUR' || 
          auth.authority === 'MODIFY_TOUR'
        );
        console.log('Has update authority:', hasUpdateAuth);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
      
      const authHeaders = getAuthHeaders();
      console.log('Auth headers for PUT:', authHeaders);
      console.log('Token check:', authHeaders.Authorization);
      
      // Check if we have valid auth headers
      if (!authHeaders.Authorization || authHeaders.Authorization === 'Bearer null' || authHeaders.Authorization === 'Bearer undefined') {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      const res = await fetch(`${TOURS_API}/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(tourData),
      });

      console.log('Update response status:', res.status);
      console.log('Update response headers:', res.headers);

      if (res.ok) {
        const responseData = await res.json();
        console.log('Update successful:', responseData);
        alert('Tour updated successfully!');
        navigate(`/admin/tours/${id}`);
      } else if (res.status === 403) {
        const errorText = await res.text();
        console.error('403 Forbidden:', errorText);
        throw new Error(`Access denied. You may not have permission to edit this tour. Status: ${res.status}`);
      } else if (res.status === 401) {
        const errorText = await res.text();
        console.error('401 Unauthorized:', errorText);
        throw new Error(`Authentication failed. Please log in again. Status: ${res.status}`);
      } else {
        const errorText = await res.text();
        console.error('Update failed:', res.status, errorText);
        throw new Error(`Failed to update tour: ${res.status} ${res.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('Error updating tour:', err);
      setError(err.message || 'Failed to update tour');
      alert(err.message || 'Failed to update tour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-lg">Loading tour details...</span>
        </div>
      </div>
    );
  }

  if (error && !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <ContentCard>
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tour</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin/tours')}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tours
                  </Button>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="p-6 space-y-8">
        {/* Header */}
        <PageHeader
          title="Edit Tour"
          subtitle={`Editing: ${tour?.name || 'Loading...'}`}
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
          action={
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/tours')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </Button>
              <Button 
                onClick={() => navigate(`/admin/tours/${id}`)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Tour
              </Button>
            </div>
          }
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <ContentCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter tour name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Brief description of the tour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Detailed description of the tour"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="ADVENTURE">Adventure</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="WILDLIFE">Wildlife</option>
                    <option value="BEACH">Beach</option>
                    <option value="HISTORICAL">Historical</option>
                    <option value="WELLNESS">Wellness</option>
                    <option value="RELIGIOUS">Religious</option>
                    <option value="NATURE">Nature</option>
                    <option value="PHOTOGRAPHY">Photography</option>
                    <option value="FAMILY">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="WESTERN">Western</option>
                    <option value="CENTRAL">Central</option>
                    <option value="SOUTHERN">Southern</option>
                    <option value="NORTHERN">Northern</option>
                    <option value="EASTERN">Eastern</option>
                    <option value="NORTH_WESTERN">North Western</option>
                    <option value="NORTH_CENTRAL">North Central</option>
                    <option value="UVA">Uva</option>
                    <option value="SABARAGAMUWA">Sabaragamuwa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="EASY">Easy</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="HARD">Hard</option>
                  <option value="EXTREME">Extreme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="INCOMPLETE">Incomplete</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </ContentCard>

          {/* Pricing and Duration */}
          <ContentCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pricing & Availability</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Person (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Spots <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="availableSpots"
                  value={formData.availableSpots}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Number of available spots"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durationValue"
                  value={formData.durationValue}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter duration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="HOURS">Hours</option>
                  <option value="DAYS">Days</option>
                  <option value="WEEKS">Weeks</option>
                </select>
              </div>
            </div>
          </ContentCard>

          {/* Activities */}
          <ContentCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Activities</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Activities</label>
                <select
                  onChange={(e) => {
                    handleActivityAdd(e.target.value);
                    e.target.value = '';
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select an activity to add...</option>
                  {availableActivities.map((activity) => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>

              {formData.activities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Activities</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
                      >
                        {activity}
                        <button
                          type="button"
                          onClick={() => handleActivityRemove(activity)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ContentCard>

          {/* Itinerary */}
          <ContentCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Itinerary</h3>
              </div>
              <Button
                type="button"
                onClick={addItineraryDay}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg shadow-orange-500/25"
              >
                Add Day
              </Button>
            </div>
            
            <div className="space-y-6">
              {formData.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-gray-50 p-6 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Day {day.day}</h4>
                    <Button
                      type="button"
                      onClick={() => removeItineraryDay(dayIndex)}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove Day
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day Title</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter day title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day Description</label>
                      <textarea
                        value={day.description}
                        onChange={(e) => handleItineraryChange(dayIndex, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe the day's activities"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Places</label>
                      <select
                        onChange={(e) => {
                          handleItineraryPlaceAdd(dayIndex, e.target.value);
                          e.target.value = '';
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a place to add...</option>
                        {availablePlaces.map((place) => (
                          <option key={place} value={place}>{place}</option>
                        ))}
                      </select>
                    </div>
                    
                    {day.places && day.places.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selected Places</label>
                        <div className="flex flex-wrap gap-2">
                          {day.places.map((place, placeIndex) => (
                            <span
                              key={placeIndex}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                            >
                              {place}
                              <button
                                type="button"
                                onClick={() => handleItineraryPlaceRemove(dayIndex, place)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {formData.itinerary.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No itinerary days added yet. Click "Add Day" to start building your tour itinerary.</p>
                </div>
              )}
            </div>
          </ContentCard>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25 min-w-[200px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Tour
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
