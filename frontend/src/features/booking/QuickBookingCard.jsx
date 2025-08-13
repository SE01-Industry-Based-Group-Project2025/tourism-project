// src/features/booking/QuickBookingCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import ContentCard from '../../components/ui/ContentCard';

const QuickBookingCard = ({ tour }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isUser, getAuthHeaders } = useAuth();
  const [guestCount, setGuestCount] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Check for existing booking when component mounts
  React.useEffect(() => {
    if (isAuthenticated && tour?.id) {
      checkExistingBooking();
    }
  }, [isAuthenticated, tour?.id]);

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
          booking.tourId === tour.id && 
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

  // Don't show for templates
  if (tour?.isTemplate === true) {
    return null;
  }

  // Don't show if no availability ranges
  if (!tour?.availabilityRanges || tour.availabilityRanges.length === 0) {
    return (
      <ContentCard>
        <div className="text-center py-6">
          <div className="text-yellow-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Dates</h3>
          <p className="text-gray-600">This tour doesn't have any scheduled dates available yet.</p>
        </div>
      </ContentCard>
    );
  }

  // Get the single availability range
  const availabilityRange = tour.availabilityRanges[0];
  const startDate = new Date(availabilityRange.startDate);
  const endDate = new Date(availabilityRange.endDate);
  const today = new Date();

  // Check if the tour period has expired
  if (endDate < today) {
    return (
      <ContentCard>
        <div className="text-center py-6">
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tour Period Expired</h3>
          <p className="text-gray-600">This tour period has ended. Please check other tours.</p>
        </div>
      </ContentCard>
    );
  }

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isUser) {
      setError('Only users can book tours. Please log in with a user account.');
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/bookings/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          tourId: parseInt(tour.id),
          selectedDate: availabilityRange.startDate, // Use start date of the range
          guestCount: parseInt(guestCount),
          specialNote: null,
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalPrice = tour.price * guestCount;

  return (
    <ContentCard>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Book This Tour</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Availability Display */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-3">📅 Tour Schedule</h4>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <div className="text-sm text-blue-600 font-medium">Start Date</div>
              <div className="text-blue-900 font-semibold">
                {formatDate(availabilityRange.startDate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium">End Date</div>
              <div className="text-blue-900 font-semibold">
                {formatDate(availabilityRange.endDate)}
              </div>
            </div>
          </div>
          <p className="text-blue-600 text-sm">
            👥 {availabilityRange.availableSpots || 'Multiple'} spots available • 💰 ${tour.price} per person
          </p>
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Price:</span>
            <span className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            ${tour.price} × {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </div>
        </div>

        {/* Book Button */}
        {checkingBooking ? (
          <Button
            disabled
            className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking existing bookings...
          </Button>
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
                You already have a booking for this tour. Check your bookings to view details.
              </p>
            </div>
            <Button
              onClick={() => navigate('/dashboard?tab=bookings')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View My Bookings
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleBookNow}
            disabled={isBooking}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Book Now - ${totalPrice.toFixed(2)}
              </>
            )}
          </Button>
        )}

        <p className="text-xs text-gray-500 text-center">
          You'll be redirected to secure payment after clicking Book Now
        </p>
      </div>
    </ContentCard>
  );
};

export default QuickBookingCard;
