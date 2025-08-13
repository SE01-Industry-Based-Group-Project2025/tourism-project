// src/features/booking/BookingSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import ContentCard from '../../components/ui/ContentCard';
import ReceiptLink from '../../components/ui/ReceiptLink';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [bookingId, setBookingId] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchBookingDetails = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/bookings/${id}`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);
      } else {
        console.error('Failed to fetch booking details');
        setError('Could not load booking details');
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Error loading booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get session ID from URL params (optional)
    const sessionId = searchParams.get('session_id');
    
    // Get booking ID from session storage
    const storedBookingId = sessionStorage.getItem('lastBookingId');
    if (storedBookingId) {
      setBookingId(storedBookingId);
      fetchBookingDetails(storedBookingId);
      // Clean up session storage
      sessionStorage.removeItem('lastBookingId');
    }

    console.log('Booking success - Session ID:', sessionId, 'Booking ID:', storedBookingId);
    
    // Auto-redirect to dashboard with bookings tab after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard?tab=bookings');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Booking Confirmed!"
          subtitle="Your payment has been processed successfully"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />

        <div className="mt-8">
          <ContentCard>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Received Successfully!
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you for your booking. Your payment has been processed and your booking will be confirmed shortly.
              </p>

              {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">Loading booking details...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {booking && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><span className="font-medium">Booking Reference:</span> #{booking.id}</p>
                    {booking.tourName && (
                      <p><span className="font-medium">Tour:</span> {booking.tourName}</p>
                    )}
                    {booking.selectedDate && (
                      <p><span className="font-medium">Date:</span> {new Date(booking.selectedDate).toLocaleDateString()}</p>
                    )}
                    {booking.totalAmount && (
                      <p><span className="font-medium">Total:</span> ${booking.totalAmount}</p>
                    )}
                  </div>
                </div>
              )}

              {!loading && !booking && bookingId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Booking Reference:</span> #{bookingId}
                  </p>
                </div>
              )}

              {/* Receipt Link Section */}
              {booking?.status === 'CONFIRMED' && booking?.payment?.receiptUrl ? (
                <div className="mb-6">
                  <div className="inline-flex flex-col items-center gap-3">
                    <ReceiptLink url={booking.payment.receiptUrl} size="md" variant="primary" />
                    <p className="text-xs text-gray-500">Your Stripe receipt is ready</p>
                  </div>
                </div>
              ) : booking?.status === 'CONFIRMED' ? (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Receipt link not available yet. Stripe will email your receipt.
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Stripe will email your receipt once the payment is confirmed.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/dashboard?tab=bookings')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  Go to My Bookings
                </Button>
                
                <Button
                  onClick={() => navigate('/tours')}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Browse More Tours
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
                <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>You'll receive a confirmation email within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Check your booking status in "My Bookings"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Our team will contact you with tour details closer to your travel date</p>
                  </div>
                </div>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
