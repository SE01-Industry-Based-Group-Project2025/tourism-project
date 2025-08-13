// src/features/booking/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import PageHeader from '../../components/ui/PageHeader';
import ContentCard from '../../components/ui/ContentCard';

const BookingForm = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders, isAuthenticated, isUser } = useAuth();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  
  // Form errors
  const [dateRangeError, setDateRangeError] = useState('');
  const [guestError, setGuestError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Redirect if not authenticated or not a user
    if (!isAuthenticated || !isUser) {
      navigate('/login');
      return;
    }

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError('');
        
        const res = await fetch(`${API_BASE}/api/tours/${tourId}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (res.ok) {
          const data = await res.json();
          setTour(data);
          
          // Don't allow booking templates
          if (data.isTemplate) {
            setError('This is a template and cannot be booked.');
          }
        } else {
          setError('Failed to load tour details.');
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Error loading tour details.');
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId, isAuthenticated, isUser, navigate, API_BASE, getAuthHeaders]);

  const validateForm = () => {
    let isValid = true;
    
    // Date range validation
    if (!selectedDateRange) {
      setDateRangeError('Please select an available date range');
      isValid = false;
    } else {
      setDateRangeError('');
    }
    
    // Guest count validation
    if (!guestCount || guestCount < 1) {
      setGuestError('At least 1 guest is required');
      isValid = false;
    } else if (guestCount > 10) {
      setGuestError('Maximum 10 guests allowed');
      isValid = false;
    } else if (!Number.isInteger(Number(guestCount))) {
      setGuestError('Guest count must be a whole number');
      isValid = false;
    } else {
      setGuestError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      // Parse the selected date range and use the start date for booking
      const [startDate] = selectedDateRange.split('|');
      
      const response = await fetch(`${API_BASE}/api/bookings/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          tourId: parseInt(tourId),
          selectedDate: startDate, // Use start date of the selected range
          guestCount: parseInt(guestCount),
          specialNote: specialNote.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save booking ID for success page
        if (data.bookingId) {
          sessionStorage.setItem('lastBookingId', data.bookingId.toString());
        }
        
        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError('No checkout URL received from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Booking failed' }));
        
        // Handle specific error cases
        if (response.status === 403) {
          setError('The selected schedule is not available. Please choose a different date range.');
        } else if (response.status === 400) {
          setError(errorData.message || 'Invalid booking details. Please check your selections.');
        } else {
          setError(errorData.message || 'Failed to create booking');
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Error creating booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = tour?.price * guestCount || 0;

  // Get selected schedule info for display
  const getSelectedScheduleInfo = () => {
    if (!selectedDateRange) return null;
    
    const [startDate, endDate] = selectedDateRange.split('|');
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error && !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/tours')} variant="outline">
            Back to Tours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title={`Book: ${tour?.name || 'Tour'}`}
          subtitle="Complete your booking details below"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          action={
            <Button variant="outline" onClick={() => navigate(`/tours/${tourId}`)}>
              Back to Tour
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Tour Summary */}
          <ContentCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tour Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tour Name:</span>
                <span className="font-medium">{tour?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{tour?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{tour?.durationValue} {tour?.durationUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per person:</span>
                <span className="font-medium text-green-600">${tour?.price}</span>
              </div>
              {selectedDateRange && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Schedule:</span>
                  <span className="font-medium text-blue-600">{getSelectedScheduleInfo()}</span>
                </div>
              )}
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-green-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </ContentCard>

          {/* Booking Form */}
          <ContentCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="selectedDateRange" className="block text-sm font-medium text-gray-700">
                  Choose Tour Schedule *
                </Label>
                {tour?.availabilityRanges && tour.availabilityRanges.length > 0 ? (
                  <select
                    id="selectedDateRange"
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select when you want to join this tour</option>
                    {tour.availabilityRanges.map((range, index) => {
                      const startDate = new Date(range.startDate);
                      const endDate = new Date(range.endDate);
                      const formatDate = (date) => date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                      
                      // Calculate if this range is in the past
                      const today = new Date();
                      const isExpired = endDate < today;
                      
                      return (
                        <option 
                          key={index} 
                          value={`${range.startDate}|${range.endDate}`}
                          disabled={isExpired}
                        >
                          {formatDate(startDate)} - {formatDate(endDate)}
                          {isExpired ? ' (Expired)' : ''}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="mt-1 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-600 text-sm">
                      No scheduled dates available for this tour. Please contact support.
                    </p>
                  </div>
                )}
                {dateRangeError && (
                  <p className="mt-1 text-sm text-red-600">{dateRangeError}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  This tour runs on scheduled dates only. Select the schedule that works for you.
                </p>
              </div>

              <div>
                <Label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                  Number of Guests *
                </Label>
                <Input
                  type="number"
                  id="guestCount"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                  className="mt-1"
                  required
                />
                {guestError && (
                  <p className="mt-1 text-sm text-red-600">{guestError}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Maximum 10 guests per booking
                </p>
              </div>

              <div>
                <Label htmlFor="specialNote" className="block text-sm font-medium text-gray-700">
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="specialNote"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  rows={3}
                  className="mt-1"
                  placeholder="Any special requests or dietary requirements..."
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Proceed to Payment - $${totalPrice.toFixed(2)}`
                  )}
                </Button>
              </div>
            </form>
          </ContentCard>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
