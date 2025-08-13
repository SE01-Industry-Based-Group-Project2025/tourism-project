// src/features/admin/bookings/AdminBookings.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/feedback/useToast';
import PageHeader from '../../../components/ui/PageHeader';
import ContentCard from '../../../components/ui/ContentCard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Eye, Search, Calendar, Users, CreditCard } from 'lucide-react';

// Status pill component
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default function AdminBookings() {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const toast = useToast();

  // State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_BASE = 'http://localhost:8080';

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/admin/bookings`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const data = await response.json();
      
      // Debug: Log the response structure
      console.log('API Response:', data);
      
      // Handle paginated response structure
      if (data.content && Array.isArray(data.content)) {
        console.log('Found paginated content:', data.content.length, 'bookings');
        setBookings(data.content);
        // Optionally store pagination info if needed
        console.log('Pagination info:', {
          currentPage: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements
        });
      } else if (Array.isArray(data)) {
        console.log('Found direct array:', data.length, 'bookings');
        setBookings(data);
      } else {
        console.warn('Unexpected API response format:', data);
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const emailMatch = !searchEmail || 
        booking.userEmail?.toLowerCase().includes(searchEmail.toLowerCase()) ||
        booking.userName?.toLowerCase().includes(searchEmail.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || 
        booking.status?.toUpperCase() === statusFilter.toUpperCase();

      return emailMatch && statusMatch;
    });
  }, [bookings, searchEmail, statusFilter]);

  // Handle view booking
  const handleViewBooking = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`);
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    if (!amount || !currency) return '—';
    return `${currency} ${Number(amount).toFixed(2)}`;
  };

  // Format date
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
          <PageHeader 
            title="Admin Bookings" 
            subtitle="Manage and view all tour bookings"
          />
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading bookings...</span>
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
          <PageHeader 
            title="Admin Bookings" 
            subtitle="Manage and view all tour bookings"
          />
          <ContentCard>
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">Error loading bookings</div>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchBookings}>
                Try Again
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
        <PageHeader 
          title="Admin Bookings" 
          subtitle="Manage and view all tour bookings"
        />

        {/* Filters */}
        <ContentCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Email/Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter email or name..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="failed">Failed</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchEmail('');
                  setStatusFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </ContentCard>

        {/* Bookings Table */}
        <ContentCard>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                {bookings.length === 0 
                  ? "No bookings have been made yet." 
                  : "No bookings match your current filters."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
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
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {booking.userName || '—'}
                          </div>
                          {booking.userEmail && (
                            <div className="text-gray-500 text-xs">
                              {booking.userEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {booking.tourName || booking.tourNameSnapshot || `Tour #${booking.tourId}` || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.selectedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          {booking.guestCount || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                          {formatCurrency(booking.totalAmount, booking.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusPill status={booking.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => handleViewBooking(booking.id)}
                          size="sm"
                          className="inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ContentCard>

        {/* Summary */}
        {filteredBookings.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
