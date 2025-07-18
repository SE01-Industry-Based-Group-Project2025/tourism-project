import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import ContentCard from "../components/ui/ContentCard";
import StatsCard from "../components/ui/StatsCard";

export default function QuoteRequests() {
  const { getAuthHeaders } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRequestInProgress = useRef(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    quoted: 0,
    confirmed: 0,
    conversionRate: 0,
    avgResponseTime: '0h'
  });

  // API Configuration
  const API_BASE = 'http://localhost:8080';
  const CUSTOM_TOURS_API = `${API_BASE}/api/tours/all-custom`;

  // Fetch custom tour requests from backend
  const fetchCustomTourRequests = async () => {
    // Prevent multiple concurrent requests
    if (isRequestInProgress.current) {
      console.log('Request already in progress, skipping...');
      return;
    }

    try {
      isRequestInProgress.current = true;
      setLoading(true);
      setError(null);
      
      // Check if auth headers are available
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        throw new Error('Authentication required');
      }
      
      console.log('Fetching custom tour requests from:', CUSTOM_TOURS_API);
      
      const response = await fetch(CUSTOM_TOURS_API, {
        method: 'GET',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch custom tour requests: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched custom tour requests:', data);
      
      // Transform backend data to match UI structure
      const transformedRequests = data.map(request => ({
        id: `QR-${request.id}`,
        customer: request.name || 'Unknown Customer',
        email: request.user?.email || 'No email provided',
        tour: request.tourName || 'Custom Tour Request',
        travelers: request.groupSize || 1,
        budget: request.price ? `$${request.price}` : 'Budget not specified',
        dates: request.startDate && request.endDate 
          ? `${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`
          : 'Dates not specified',
        status: request.status || 'Pending',
        submitted: request.createdAt 
          ? new Date(request.createdAt).toLocaleDateString()
          : 'Unknown',
        notes: request.specialRequirements || 'No special requirements',
        duration: request.durationValue && request.durationUnit 
          ? `${request.durationValue} ${request.durationUnit}` 
          : 'Duration not specified',
        region: request.region || 'Region not specified',
        activities: request.activities || []
      }));

      setRequests(transformedRequests);
      
      // Calculate stats
      const totalRequests = transformedRequests.length;
      const pendingRequests = transformedRequests.filter(r => r.status === 'Pending').length;
      const quotedRequests = transformedRequests.filter(r => r.status === 'Quoted').length;
      const confirmedRequests = transformedRequests.filter(r => r.status === 'Confirmed').length;
      const conversionRate = totalRequests > 0 ? ((confirmedRequests / totalRequests) * 100).toFixed(1) : 0;

      setStats({
        total: totalRequests,
        pending: pendingRequests,
        quoted: quotedRequests,
        confirmed: confirmedRequests,
        conversionRate: `${conversionRate}%`,
        avgResponseTime: '4.2h' // This would come from backend analytics
      });

    } catch (err) {
      console.error('Error fetching custom tour requests:', err);
      setError(err.message);
      toast.error('Failed to load quote requests');
      
      // Set empty data on error
      setRequests([]);
      setStats({
        total: 0,
        pending: 0,
        quoted: 0,
        confirmed: 0,
        conversionRate: '0%',
        avgResponseTime: '0h'
      });
    } finally {
      setLoading(false);
      isRequestInProgress.current = false;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCustomTourRequests();
    
    // Cleanup function to reset request flag on unmount
    return () => {
      isRequestInProgress.current = false;
    };
  }, []); // Empty dependency array - only run once on mount

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Quoted': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
      {/* Header */}
      <PageHeader
        title="Quote Requests"
        subtitle="Manage and respond to customer quote requests"
        icon={({ className }) => (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        iconColor="text-yellow-600"
        iconBgColor="bg-yellow-100"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsCard
          title="Total Requests"
          value={loading ? "..." : stats.total.toString()}
          color="yellow"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        />
        <StatsCard
          title="Pending Quotes"
          value={loading ? "..." : stats.pending.toString()}
          color="blue"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
        <StatsCard
          title="Conversion Rate"
          value={loading ? "..." : stats.conversionRate}
          color="green"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
        <StatsCard
          title="Avg. Response Time"
          value={loading ? "..." : stats.avgResponseTime}
          color="purple"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        />
      </div>

      {/* Quote Requests Table */}
      <ContentCard>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Quote Requests</h3>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option>All Requests</option>
              <option>Pending</option>
              <option>Quoted</option>
              <option>Confirmed</option>
              <option>Rejected</option>
            </select>
            <button className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              <p className="mt-2 text-gray-600">Loading quote requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Failed to load quote requests</p>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchCustomTourRequests}
                className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No quote requests found</p>
              <p className="text-gray-500 text-sm mt-1">Custom tour requests will appear here when submitted by tourists.</p>
            </div>
          ) : (
            requests.map((request) => (
            <div key={request.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">{request.id}</span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-400">{request.submitted}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{request.customer}</h4>
                  <p className="text-sm text-gray-600 mb-2">{request.email}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Send Quote
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tour Package</p>
                  <p className="font-medium text-gray-900">{request.tour}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Travelers</p>
                  <p className="font-medium text-gray-900">{request.travelers} people</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="font-medium text-gray-900">{request.budget}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Travel Dates</p>
                  <p className="font-medium text-gray-900">{request.dates}</p>
                </div>
              </div>

              {/* Additional tour details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-medium text-gray-900">{request.duration}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Region</p>
                  <p className="font-medium text-gray-900">{request.region}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Activities</p>
                  <p className="font-medium text-gray-900">
                    {Array.isArray(request.activities) && request.activities.length > 0 
                      ? request.activities.join(', ') 
                      : 'Activities not specified'}
                  </p>
                </div>
              </div>

              {request.notes && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Special Requirements</p>
                  <p className="text-sm text-gray-700">{request.notes}</p>
                </div>
              )}
            </div>
          ))
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={fetchCustomTourRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>
      </ContentCard>
      </div>
    </div>
  );
}
