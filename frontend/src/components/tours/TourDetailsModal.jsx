// src/components/tours/TourDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTours } from '../../contexts/ToursContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaTimes, FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaHeart, FaShare } from 'react-icons/fa';

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
      
      // Map the API response to match frontend expectations
      const mappedTour = {
        ...result.data,
        // Map itineraryDays to itinerary with correct structure
        itinerary: result.data.itineraryDays?.map(day => ({
          day: day.dayNumber,
          title: day.title,
          description: day.description,
          activities: day.activities || [],
          meals: day.meals || [],
          places: day.places || []
        })) || []
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
                        <div className="space-y-4">
                          {tour.itinerary.map((day, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Day {day.day}: {day.title}
                              </h4>
                              <p className="text-gray-700 mb-3">{day.description}</p>
                              
                              {/* Places */}
                              {day.places && day.places.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-gray-800">Places to Visit:</h5>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {day.places.map((place, placeIndex) => (
                                      <li key={placeIndex}>{place.name || place}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Activities */}
                              {day.activities && day.activities.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-gray-800">Activities:</h5>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {day.activities.map((activity, actIndex) => (
                                      <li key={actIndex}>{activity.name || activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Meals */}
                              {day.meals && day.meals.length > 0 && (
                                <div className="text-sm text-gray-600">
                                  <strong>Meals:</strong> {day.meals.map(meal => meal.name || meal).join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Detailed itinerary information will be provided upon booking.</p>
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
