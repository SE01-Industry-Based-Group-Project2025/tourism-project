// src/components/tours/TourDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTours } from '../../contexts/ToursContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaTimes, FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaHeart, FaShare, FaChevronDown, FaChevronUp, FaBed, FaRoute } from 'react-icons/fa';

// Expandable Itinerary Component
function ExpandableItinerary({ itinerary }) {
  const [expandedDays, setExpandedDays] = useState(new Set([0])); // First day expanded by default

  const toggleDay = (dayIndex) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
  };

  const expandAll = () => {
    setExpandedDays(new Set(itinerary.map((_, index) => index)));
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={expandAll}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Collapse All
        </button>
      </div>

      {/* Itinerary Days */}
      {itinerary.map((day, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Day Header - Always Visible */}
          <div
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
            onClick={() => toggleDay(index)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {day.day || index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {day.title || `Day ${day.day || index + 1}`}
                </h4>
                {!expandedDays.has(index) && day.description && (
                  <p className="text-gray-600 text-sm truncate max-w-md">
                    {day.description.substring(0, 100)}...
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {expandedDays.has(index) ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
          </div>

          {/* Day Details - Expandable */}
          {expandedDays.has(index) && (
            <div className="p-4 bg-white border-t border-gray-100">
              {/* Description */}
              {day.description && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{day.description}</p>
                </div>
              )}

              {/* Transport & Time Info */}
              {(day.transportMode || day.estimatedTime) && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center gap-4 text-sm">
                    {day.transportMode && (
                      <div className="flex items-center gap-2">
                        <FaRoute className="text-blue-600" />
                        <span className="text-blue-800 font-medium">Transport:</span>
                        <span className="text-blue-700">{day.transportMode}</span>
                      </div>
                    )}
                    {day.estimatedTime && (
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-600" />
                        <span className="text-blue-800 font-medium">Duration:</span>
                        <span className="text-blue-700">{day.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Destinations */}
                  {day.destinations && day.destinations.length > 0 && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <h5 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-indigo-600" />
                        Key Destinations
                      </h5>
                      <div className="space-y-3">
                        {day.destinations.map((destination, destIndex) => (
                          <div key={destIndex} className="bg-white rounded-md p-3 border border-indigo-100">
                            <div className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                              <div>
                                <h6 className="font-medium text-indigo-900">
                                  {destination.name || destination}
                                </h6>
                                {destination.description && (
                                  <p className="text-sm text-indigo-700 mt-1">{destination.description}</p>
                                )}
                                {destination.type && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                    {destination.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Places to Visit (if different from destinations) */}
                  {day.places && day.places.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-600" />
                        Places to Visit
                      </h5>
                      <div className="space-y-2">
                        {day.places.map((place, placeIndex) => (
                          <div key={placeIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            <div>
                              <span className="text-green-700 text-sm font-medium">
                                {place.name || place}
                              </span>
                              {place.description && (
                                <p className="text-xs text-green-600 mt-0.5">{place.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <FaStar className="text-orange-600" />
                        Activities & Experiences
                      </h5>
                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="bg-white rounded-md p-3 border border-orange-100">
                            <div className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                              <div>
                                <h6 className="font-medium text-orange-900">
                                  {activity.name || activity}
                                </h6>
                                {activity.description && (
                                  <p className="text-sm text-orange-700 mt-1">{activity.description}</p>
                                )}
                                {activity.duration && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <FaClock className="text-orange-600 text-xs" />
                                    <span className="text-xs text-orange-600">{activity.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Accommodation */}
                  {day.accommodation && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                        <FaBed className="text-purple-600" />
                        Accommodation
                      </h5>
                      <div className="bg-white rounded-md p-3 border border-purple-100">
                        <h6 className="font-medium text-purple-900">
                          {day.accommodation.name || day.accommodation}
                        </h6>
                        {day.accommodation.type && (
                          <p className="text-sm text-purple-700 mt-1">
                            Type: {day.accommodation.type}
                          </p>
                        )}
                        {day.accommodation.rating && (
                          <p className="text-sm text-purple-700">
                            Rating: {day.accommodation.rating}
                          </p>
                        )}
                        {day.accommodation.description && (
                          <p className="text-sm text-purple-600 mt-2">
                            {day.accommodation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* No Content Fallback */}
              {(!day.destinations || day.destinations.length === 0) && 
               (!day.places || day.places.length === 0) && 
               (!day.activities || day.activities.length === 0) && 
               !day.accommodation && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-500">
                    <FaMapMarkerAlt className="mx-auto h-8 w-8 mb-3 text-gray-400" />
                    <h6 className="font-medium text-gray-700 mb-2">Itinerary Details Coming Soon</h6>
                    <p className="text-sm">
                      Detailed destinations, activities, and accommodation information 
                      will be available once you book this tour.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TourDetailsModal({ tourId, isOpen, onClose }) {
  const { fetchTourById, loading } = useTours();
  const { isAuthenticated, isUser, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isOpen && tourId) {
      loadTourDetails();
      if (isAuthenticated) {
        checkExistingBooking();
      }
    }
  }, [isOpen, tourId, isAuthenticated]);

  const checkExistingBooking = async () => {
    try {
      setCheckingBooking(true);
      const response = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.content || [];
        const existingBooking = bookings.find(booking => 
          booking.tourId === tourId && 
          booking.status !== 'CANCELLED'
        );
        setHasExistingBooking(!!existingBooking);
      }
    } catch (error) {
      console.error('Error checking existing booking:', error);
    } finally {
      setCheckingBooking(false);
    }
  };

  const loadTourDetails = async () => {
    const result = await fetchTourById(tourId);
    if (result.success) {
      console.log('Complete tour data:', result.data); // Debug log
      console.log('Itinerary data:', result.data.itineraryDays); // Debug log
      
      // Enhanced mapping to handle different API response structures
      let itineraryData = [];
      
      // Get tour-level data for distribution across days
      const tourActivities = result.data.activities || [];
      const tourAccommodations = result.data.accommodations || [];
      const tourHighlights = result.data.highlights || [];
      
      // Try different possible sources for itinerary data
      if (result.data.itinerary && Array.isArray(result.data.itinerary)) {
        itineraryData = result.data.itinerary.map((day, index) => {
          // Distribute tour-level accommodations across days (except last day)
          const dayAccommodation = index < tourAccommodations.length ? 
            tourAccommodations[index] : 
            (index < result.data.itinerary.length - 1 && tourAccommodations.length > 0 ? 
              tourAccommodations[index % tourAccommodations.length] : null);
          
          // Distribute activities across days
          const activitiesPerDay = Math.ceil(tourActivities.length / result.data.itinerary.length);
          const dayActivities = tourActivities.slice(
            index * activitiesPerDay, 
            (index + 1) * activitiesPerDay
          );
          
          // Add some of the tour highlights as activities for this day
          const highlightsForDay = tourHighlights.filter((_, hIndex) => 
            hIndex % result.data.itinerary.length === index
          );
          
          return {
            day: day.dayNumber || day.day || index + 1,
            title: day.title || day.name || `Day ${day.dayNumber || day.day || index + 1}`,
            description: day.description || day.details || '',
            destinations: Array.isArray(day.destinations) ? 
              day.destinations.map(dest => ({
                name: dest.name || dest,
                description: dest.description || '',
                type: dest.type || 'Tourist attraction'
              })) : 
              (day.destinations ? [{ name: day.destinations, type: 'Tourist attraction' }] : []),
            activities: [
              ...dayActivities.map(activity => ({
                name: activity.name || activity,
                description: activity.description || `Experience ${activity.name || activity} in ${day.title}`,
                duration: activity.duration || '2-3 hours'
              })),
              ...highlightsForDay.map(highlight => ({
                name: highlight,
                description: `${highlight} - one of the tour highlights`,
                duration: '1-2 hours'
              }))
            ],
            places: Array.isArray(day.destinations) ? 
              day.destinations.map(dest => ({ name: dest.name || dest })) : 
              (day.destinations ? [{ name: day.destinations }] : []),
            accommodation: dayAccommodation ? {
              name: dayAccommodation.title || dayAccommodation.name || dayAccommodation,
              type: dayAccommodation.type || 'Hotel',
              rating: dayAccommodation.rating || '4-star',
              description: dayAccommodation.description || `Comfortable accommodation for ${day.title}`
            } : null,
            transportMode: index === 0 ? 'Airport transfer & Private vehicle' : 
                          index === result.data.itinerary.length - 1 ? 'Private vehicle to airport' : 
                          'Private tour vehicle',
            estimatedTime: '6-8 hours of activities'
          };
        });
      } else if (result.data.itineraryDays && Array.isArray(result.data.itineraryDays)) {
        // Fallback to itineraryDays format
        itineraryData = result.data.itineraryDays.map((day, index) => ({
          day: day.dayNumber || day.day || index + 1,
          title: day.title || day.name || `Day ${day.dayNumber || day.day || index + 1}`,
          description: day.description || day.details || '',
          activities: Array.isArray(day.activities) ? day.activities : (day.activities ? [day.activities] : []),
          places: Array.isArray(day.places) ? day.places : (day.places ? [day.places] : []),
          destinations: Array.isArray(day.destinations) ? day.destinations : (day.destinations ? [day.destinations] : []),
          accommodation: day.accommodation || day.hotel || day.lodging || null,
          transportMode: day.transportMode || day.transport || '',
          estimatedTime: day.estimatedTime || day.duration || ''
        }));
      } else if (result.data.duration && result.data.duration > 0) {
        // Generate enhanced sample itinerary based on tour data
        const duration = parseInt(result.data.durationValue) || parseInt(result.data.duration) || 1;
        const tourName = result.data.name || result.data.title || 'Tour';
        
        itineraryData = Array.from({ length: duration }, (_, index) => ({
          day: index + 1,
          title: index === 0 ? `Arrival & ${tourName} Begins` : 
                 index === duration - 1 ? `Final Day & Departure` : 
                 `${tourName} - Day ${index + 1}`,
          description: index === 0 ? `Begin your exciting ${tourName} journey with arrival and orientation.` :
                      index === duration - 1 ? `Conclude your amazing ${tourName} experience and prepare for departure.` :
                      `Continue exploring the highlights of ${tourName} with today's planned activities and destinations.`,
          activities: tourActivities.length > 0 ? 
            tourActivities.slice(index * Math.ceil(tourActivities.length / duration), (index + 1) * Math.ceil(tourActivities.length / duration)).map(activity => ({
              name: activity.name || activity,
              description: `Experience ${activity.name || activity}`,
              duration: '2-3 hours'
            })) :
            [
              { name: `Guided tour activities for day ${index + 1}`, description: 'Professional guided experience', duration: '3-4 hours' },
              { name: `Local cultural experiences`, description: 'Immerse in local culture', duration: '2-3 hours' },
              { name: `Sightseeing and exploration`, description: 'Discover amazing sights', duration: '2-3 hours' }
            ],
          places: [{ name: `Key destination ${index + 1}`, description: `Important location for day ${index + 1}` }],
          destinations: [{ name: `Primary destination for day ${index + 1}`, type: 'Tourist attraction' }],
          accommodation: index < duration - 1 && tourAccommodations.length > 0 ? 
            tourAccommodations[index % tourAccommodations.length] ? {
              name: tourAccommodations[index % tourAccommodations.length].title || tourAccommodations[index % tourAccommodations.length].name,
              type: 'Hotel',
              rating: '4-star',
              description: tourAccommodations[index % tourAccommodations.length].description || 'Comfortable accommodation with modern amenities'
            } : {
              name: `${tourName} Hotel - Day ${index + 1}`,
              type: 'Hotel',
              rating: '4-star',
              description: 'Comfortable accommodation with modern amenities'
            } : null,
          transportMode: index === 0 ? 'Airport transfer' : 'Tour bus',
          estimatedTime: '6-8 hours'
        }));
      }
      
      // Map the API response to match frontend expectations
      const mappedTour = {
        ...result.data,
        itinerary: itineraryData
      };
      
      setTour(mappedTour);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookNow = async () => {
    // Check authentication
    if (!isAuthenticated) {
      onClose(); // Close modal first
      navigate('/login');
      return;
    }

    if (!isUser) {
      setError('Only users can book tours. Please log in with a user account.');
      return;
    }

    // Don't allow booking templates
    if (tour?.isTemplate === true) {
      setError('This is a template tour. You can only book scheduled tours.');
      return;
    }

    // Check if availability range exists
    if (!tour?.availabilityRanges || tour.availabilityRanges.length === 0) {
      setError('No availability for this tour.');
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE}/api/bookings/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          tourId: parseInt(tour.id),
          selectedDate: tour.availabilityRanges[0].startDate, // Use start date of the range
          guestCount: parseInt(selectedPeople),
          specialNote: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save booking ID for success page
        if (data.bookingId) {
          sessionStorage.setItem('lastBookingId', data.bookingId.toString());
        }
        
        // Close modal and redirect to Stripe Checkout
        onClose();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError('No checkout URL received from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Booking failed' }));
        
        if (response.status === 403) {
          setError('This tour is not available for booking.');
        } else if (response.status === 400) {
          setError(errorData.message || 'Invalid booking details.');
        } else {
          setError(errorData.message || 'Failed to create booking');
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Error creating booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tour ? (
          <>
            {/* Header */}
            <div className="relative">
              <img
                src={tour.imageUrl || tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                alt={tour.title || tour.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white">
                  <h1 className="text-2xl font-bold mb-2">{tour.title || tour.name}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{tour.rating || 4.5} ({tour.reviewCount || tour.reviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{tour.location || tour.destinations?.[0] || 'Sri Lanka'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'itinerary'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'pricing'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Pricing
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">About This Tour</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {tour.description || 'Experience the best of Sri Lanka with this carefully crafted tour package.'}
                        </p>
                      </div>

                      {/* Highlights */}
                      {(tour.highlights || tour.activities) && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">Highlights</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(tour.highlights || tour.activities || []).map((highlight, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-gray-700">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* What's Included */}
                      {tour.included && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">What's Included</h3>
                          <div className="space-y-2">
                            {tour.included.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* What's Not Included */}
                      {tour.excluded && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">What's Not Included</h3>
                          <div className="space-y-2">
                            {tour.excluded.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-red-600">❌</span>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'itinerary' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Itinerary</h3>
                      {tour.itinerary && tour.itinerary.length > 0 ? (
                        <ExpandableItinerary itinerary={tour.itinerary} />
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Itinerary details are being loaded...</p>
                          <p className="text-sm mt-2">If no itinerary appears, it may not be available for this tour.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing Details</h3>
                      
                      {/* Main Pricing */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            ${tour.price || tour.cost || 0}
                          </div>
                          <p className="text-gray-600">per person</p>
                        </div>
                      </div>

                      {/* Group Pricing */}
                      {tour.groupPricing && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Group Pricing</h4>
                          <div className="space-y-2">
                            {tour.groupPricing.map((pricing, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>{pricing.groupSize}</span>
                                <span className="font-semibold">${pricing.pricePerPerson}/person</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Costs */}
                      {tour.additionalCosts && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Additional Costs</h4>
                          <div className="space-y-2">
                            {tour.additionalCosts.map((cost, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>{cost.item}</span>
                                <span className="font-semibold">${cost.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        ${tour.price || tour.cost || 0}
                      </div>
                      <p className="text-gray-600">per person</p>
                    </div>

                    <div className="space-y-4">
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                          {error}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tour Schedule
                        </label>
                        {tour?.availabilityRanges && tour.availabilityRanges.length > 0 ? (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <div className="text-sm text-blue-600 font-medium">Start Date</div>
                                <div className="text-blue-900 font-semibold">
                                  {new Date(tour.availabilityRanges[0].startDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-blue-600 font-medium">End Date</div>
                                <div className="text-blue-900 font-semibold">
                                  {new Date(tour.availabilityRanges[0].endDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-blue-600 text-sm">
                              👥 {tour.availabilityRanges[0].availableSpots || 'Multiple'} spots available
                            </div>
                          </div>
                        ) : (
                          <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                            No scheduled dates available
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of People
                        </label>
                        <select
                          value={selectedPeople}
                          onChange={(e) => setSelectedPeople(parseInt(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-700">Total Cost:</span>
                          <span className="text-xl font-bold text-gray-800">
                            ${((tour.price || tour.cost || 0) * selectedPeople).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {checkingBooking ? (
                        <button
                          disabled
                          className="w-full bg-gray-400 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
                        >
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking existing bookings...
                        </button>
                      ) : hasExistingBooking ? (
                        <div className="space-y-3">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="text-yellow-800 font-medium">Already Booked</span>
                            </div>
                            <p className="text-yellow-700 text-sm mt-1">
                              You already have a booking for this tour.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              navigate('/dashboard?tab=bookings');
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View My Bookings
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleBookNow}
                          disabled={isBooking || tour?.isTemplate || !tour?.availabilityRanges?.length}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 font-semibold flex items-center justify-center gap-2"
                        >
                          {isBooking ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : tour?.isTemplate ? (
                            'Template - Cannot Book'
                          ) : !tour?.availabilityRanges?.length ? (
                            'No Schedule Available'
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              Book Now - ${((tour?.price || tour?.cost || 0) * selectedPeople).toFixed(2)}
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex items-center justify-center space-x-4 mt-4">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                          <FaHeart />
                          <span>Add to Wishlist</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <FaShare />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Tour details not available</p>
          </div>
        )}
      </div>
    </div>
  );
}
