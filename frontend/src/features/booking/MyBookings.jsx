// src/features/booking/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import ContentCard from '../../components/ui/ContentCard';
import StatusPill from '../../components/ui/StatusPill';
import TourDetailsModal from '../../components/tours/TourDetailsModal';
import ReceiptLink from '../../components/ui/ReceiptLink';

const MyBookings = () => {
  const navigate = useNavigate();
  const { getAuthHeaders, isAuthenticated, isUser } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [showTourModal, setShowTourModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Redirect if not authenticated or not a user
    if (!isAuthenticated || !isUser) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching bookings from:', `${API_BASE}/api/bookings/my-bookings`);
        console.log('Auth headers:', getAuthHeaders());
        
        const res = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Bookings data received:', data);
          console.log('Bookings content array:', data.content);
          console.log('Number of bookings found:', data.content?.length || 0);
          // Extract the content array from the paginated response
          setBookings(data.content || []);
        } else {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          setError('Failed to load your bookings.');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error loading your bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, isUser, navigate, API_BASE, getAuthHeaders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="My Bookings"
          subtitle="View and manage your tour bookings"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )}
          action={
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Refresh
              </Button>
              <Button onClick={() => navigate('/tours')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse Tours
              </Button>
            </div>
          }
        />

        <div className="mt-8">
          <ContentCard>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">You haven't made any tour bookings yet.</p>
                <Button onClick={() => navigate('/tours')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Explore Tours
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Bookings ({bookings.length})</h3>
                
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tour
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guests
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booked
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr 
                            key={booking.id} 
                            className="hover:bg-blue-50 cursor-pointer"
                            onClick={() => {
                              setSelectedTourId(booking.tourId);
                              setShowTourModal(true);
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {booking.tour?.name || booking.tourName || 'Tour'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.tour?.category || booking.tourCategory}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(booking.selectedDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.guestCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${booking.totalAmount?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusPill status={booking.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(booking.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {(() => {
                                const hasReceipt = booking?.status === 'CONFIRMED' && booking?.payment?.receiptUrl;
                                if (hasReceipt) {
                                  return (
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <ReceiptLink url={booking.payment.receiptUrl} size="sm" />
                                    </div>
                                  );
                                } else if (booking?.status === 'CONFIRMED') {
                                  return <span className="text-gray-400 text-xs">Receipt link not available yet.</span>;
                                } else {
                                  return <span className="text-gray-400 text-xs">Receipt will be emailed by Stripe after confirmation.</span>;
                                }
                              })()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setSelectedTourId(booking.tourId);
                        setShowTourModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {booking.tour?.name || booking.tourName || 'Tour'}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {booking.tour?.category || booking.tourCategory}
                          </p>
                        </div>
                        <StatusPill status={booking.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">{formatDate(booking.selectedDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Guests:</span>
                          <p className="font-medium">{booking.guestCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <p className="font-medium">${booking.totalAmount?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Booked:</span>
                          <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
                        </div>
                      </div>
                      
                      {/* Receipt Section for Mobile */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Receipt:</span>
                        <div className="mt-1">
                          {(() => {
                            const hasReceipt = booking?.status === 'CONFIRMED' && booking?.payment?.receiptUrl;
                            if (hasReceipt) {
                              return (
                                <div onClick={(e) => e.stopPropagation()}>
                                  <ReceiptLink url={booking.payment.receiptUrl} size="sm" />
                                </div>
                              );
                            } else if (booking?.status === 'CONFIRMED') {
                              return <p className="text-xs text-gray-400">Receipt link not available yet.</p>;
                            } else {
                              return <p className="text-xs text-gray-400">Receipt will be emailed by Stripe after confirmation.</p>;
                            }
                          })()}
                        </div>
                      </div>
                      
                      {booking.specialNote && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">Special Note:</span>
                          <p className="text-sm text-gray-700 mt-1">{booking.specialNote}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ContentCard>
        </div>
      </div>

      {/* Tour Details Modal for Bookings */}
      <TourDetailsModal
        tourId={selectedTourId}
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
      />
    </div>
  );
};

export default MyBookings;
