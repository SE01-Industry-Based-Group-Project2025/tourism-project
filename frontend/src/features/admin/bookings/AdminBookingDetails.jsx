// src/features/admin/bookings/AdminBookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/feedback/useToast';
import PageHeader from '../../../components/ui/PageHeader';
import ContentCard from '../../../components/ui/ContentCard';
import { Button } from '../../../components/ui/Button';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CreditCard, 
  ExternalLink,
  Copy,
  Check,
  User,
  MapPin,
  Clock
} from 'lucide-react';

// Status pill component (reused from AdminBookings)
const StatusPill = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'FAILED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Receipt link component with copy functionality
const ReceiptLink = ({ receiptUrl }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(receiptUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy receipt URL:', err);
    }
  };

  if (!receiptUrl) {
    return (
      <div className="text-sm text-gray-500 italic">
        Receipt not available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={receiptUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
      >
        <ExternalLink className="h-4 w-4 mr-1" />
        View Receipt
      </a>
      <Button
        onClick={copyToClipboard}
        size="sm"
        variant="outline"
        className="h-8 px-2"
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
      {copied && (
        <span className="text-xs text-green-600 font-medium">Copied!</span>
      )}
    </div>
  );
};

export default function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const toast = useToast();

  // State
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:8080';

  // Fetch booking details
  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        if (response.status === 404) {
          throw new Error('Booking not found.');
        }
        throw new Error(`Failed to fetch booking details: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response structures
      if (data.booking) {
        setBooking(data.booking);
        setUser(data.user || null);
        setPayment(data.payment || null);
      } else {
        // If the response is the booking object directly
        setBooking(data);
        setUser(data.user || null);
        setPayment(data.payment || null);
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  // Format currency
  const formatCurrency = (amount, currency) => {
    if (!amount || !currency) return '—';
    return `${currency} ${Number(amount).toFixed(2)}`;
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '—';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading booking details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={() => navigate('/admin/bookings')}
              variant="outline"
              className="inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </div>
          <ContentCard>
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">Error loading booking</div>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchBookingDetails}>
                  Try Again
                </Button>
                <Button 
                  onClick={() => navigate('/admin/bookings')}
                  variant="outline"
                >
                  Back to Bookings
                </Button>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <ContentCard>
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">Booking not found</div>
              <Button onClick={() => navigate('/admin/bookings')}>
                Back to Bookings
              </Button>
            </div>
          </ContentCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/admin/bookings')}
            variant="outline"
            className="inline-flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          <PageHeader 
            title={`Booking #${booking.id}`}
            subtitle="Complete booking details and information"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Information */}
          <ContentCard>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Booking Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking ID</label>
                  <p className="text-sm text-gray-900 font-mono">#{booking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <StatusPill status={booking.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Selected Date</label>
                  <p className="text-sm text-gray-900">{formatDate(booking.selectedDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Guest Count</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    {booking.guestCount || '—'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <div className="flex items-center text-sm text-gray-900">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                    {formatCurrency(booking.totalAmount, booking.currency)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Currency</label>
                  <p className="text-sm text-gray-900">{booking.currency || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">{formatDateTime(booking.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Updated</label>
                  <p className="text-sm text-gray-900">{formatDateTime(booking.updatedAt)}</p>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* Tour Information */}
          <ContentCard>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tour Snapshot</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tour ID</label>
                <p className="text-sm text-gray-900">
                  {booking.tourId ? (
                    <a 
                      href={`/tours/${booking.tourId}`}
                      className="text-blue-600 hover:text-blue-800 font-mono"
                    >
                      #{booking.tourId}
                    </a>
                  ) : '—'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Tour Name</label>
                <p className="text-sm text-gray-900">{booking.tourNameSnapshot || '—'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Unit Price (Snapshot)</label>
                <p className="text-sm text-gray-900">
                  {formatCurrency(booking.unit_price_snapshot, booking.currency)}
                </p>
              </div>
            </div>
          </ContentCard>

          {/* User Information */}
          {user && (
            <ContentCard>
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-sm text-gray-900 font-mono">#{user.id || '—'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{user.email || '—'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-sm text-gray-900">{user.firstName || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-sm text-gray-900">{user.lastName || '—'}</p>
                  </div>
                </div>
              </div>
            </ContentCard>
          )}

          {/* Payment Information */}
          <ContentCard>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            </div>
            
            {payment ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Provider</label>
                    <p className="text-sm text-gray-900">{payment.provider || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-sm text-gray-900">{payment.status || '—'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Intent ID</label>
                  <p className="text-sm text-gray-900 font-mono break-all">
                    {payment.providerPaymentIntentId || '—'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-sm text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Currency</label>
                    <p className="text-sm text-gray-900">{payment.currency || '—'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Receipt</label>
                  <div className="mt-2">
                    <ReceiptLink receiptUrl={payment.receiptUrl} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">No payment information available</div>
              </div>
            )}
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
