// src/pages/Tours.jsx
import React, { useState, useMemo, useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/ui/StatsCard";
import ContentCard from "../components/ui/ContentCard";
import TourFilterBar from "../components/tours/TourFilterBar";
import TourTable from "../components/tours/TourTable";
import PaginationControls from "../components/ui/PaginationControls";
import { Button } from "../components/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Tours() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAuthHeaders } = useAuth();
  
  // Determine if we're in templates mode based on the route
  const isTemplateMode = location.pathname.includes('/templates');
  
  // API state
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter & pagination state
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  const [typeValue, setTypeValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE = 'http://localhost:8080';
  const TOURS_API = `${API_BASE}/api/tours`;

  // API Functions
  const fetchTours = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Admin: Fetching tours from:', TOURS_API, `(attempt ${retryCount + 1})`);
      console.log('🔐 Admin: Using auth headers:', !!getAuthHeaders());
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const res = await fetch(TOURS_API, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        // Check content type
        const contentType = res.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Tours data received:', data);
          setTours(Array.isArray(data) ? data : []);
          setError(''); // Clear any previous errors
        } else {
          // If not JSON, get as text to see what we're receiving
          const responseText = await res.text();
          console.error('Non-JSON response:', responseText.substring(0, 200));
          setError('Server returned invalid data format');
        }
      } else {
        const errorText = await res.text();
        console.error('Failed to fetch tours. Status:', res.status, 'Response:', errorText);
        setError(`Failed to fetch tours (${res.status}): ${errorText}`);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      
      // Handle specific error types with retry logic
      if (err.name === 'AbortError') {
        console.error('Request timed out');
        setError('Request timed out. The server may be slow or unavailable.');
      } else if (err.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') || 
                 err.message.includes('Failed to fetch') ||
                 err.message.includes('NetworkError')) {
        console.error('Network/encoding error:', err.message);
        
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Retrying request in ${delay}ms (${retryCount + 1}/3)...`);
          setTimeout(() => fetchTours(retryCount + 1), delay);
          return;
        } else {
          setError('Unable to connect to server after multiple attempts. Please check your connection and try again.');
        }
      } else {
        setError(`Network error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (id) => {
    try {
      const res = await fetch(`${TOURS_API}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (res.ok) {
        // Remove the deleted tour from local state
        setTours(prevTours => prevTours.filter(tour => tour.id !== id));
        alert('Tour deleted successfully');
      } else {
        alert('Failed to delete tour');
      }
    } catch (err) {
      console.error('Error deleting tour:', err);
      alert('Error deleting tour');
    }
  };

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);

  // Transform backend data to match UI expectations
  const transformTourData = (tour) => ({
    id: tour.id,
    title: tour.name,
    description: tour.shortDescription,
    duration: `${tour.durationValue} ${tour.durationUnit.toLowerCase()}`,
    price: `$${tour.price}`,
    status: tour.status.toLowerCase(),
    type: tour.category.toLowerCase(),
    rating: 4.5, // Default rating since backend doesn't provide this
    participants: tour.availableSpots,
    isTemplate: tour.isTemplate || false, // Include template flag
    createdAt: tour.createdAt,
    created_at: tour.created_at,
    dateCreated: tour.dateCreated
  });

  // Transform tours data for UI
  const transformedTours = tours.map(transformTourData);

  // Handlers
  const handleView = (id) => {
    console.log("View tour", id);
    if (isTemplateMode) {
      navigate(`/admin/templates/${id}`);
    } else {
      navigate(`/admin/tours/${id}`);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit tour", id);
    if (isTemplateMode) {
      navigate(`/admin/templates/${id}/edit`);
    } else {
      navigate(`/admin/tours/${id}/edit`);
    }
  };

  const handleCreateFromTemplate = (templateId) => {
    console.log("Create tour from template", templateId);
    navigate(`/admin/tours/new?fromTemplate=${templateId}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      await deleteTour(id);
    }
  };

  // Filter data - use transformedTours instead of static data
  const filtered = useMemo(() => {
    if (loading || !transformedTours.length) return [];
    
    return transformedTours
      .sort((a, b) => {
        // Try to sort by creation date/time if available, otherwise fall back to ID
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (a.dateCreated && b.dateCreated) {
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        } else if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        } else {
          // Fall back to ID sorting (most recent ID first)
          return b.id - a.id;
        }
      })
      .filter((t) => {
        // Filter by template mode - only show templates if in template mode, non-templates otherwise
        if (isTemplateMode) {
          return t.isTemplate === true;
        } else {
          return !t.isTemplate;
        }
      })
      .filter((t) =>
        t.title.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((t) =>
        statusValue === "all" ? true : t.status === statusValue
      )
      .filter((t) =>
        typeValue === "all" ? true : t.type === typeValue
      );
  }, [transformedTours, searchValue, statusValue, typeValue, loading, isTemplateMode]);

  // Calculate statistics from tours data - based on current mode (templates vs tours)
  const relevantTours = transformedTours.filter(tour => {
    if (isTemplateMode) {
      return tour.isTemplate === true;
    } else {
      return !tour.isTemplate;
    }
  });
  
  const activeTours = relevantTours.filter(tour => tour.status === 'incomplete' || tour.status === 'upcoming' || tour.status === 'started').length;
  const totalParticipants = relevantTours.reduce((sum, tour) => sum + tour.participants, 0);
  const averageRating = relevantTours.length > 0 
    ? (relevantTours.reduce((sum, tour) => sum + tour.rating, 0) / relevantTours.length).toFixed(1)
    : '0.0';
  const totalRevenue = relevantTours.reduce((sum, tour) => {
    const price = parseFloat(tour.price.replace('$', '').replace(',', '')) || 0;
    return sum + price;
  }, 0);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Admin</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={isTemplateMode ? "text-blue-600 font-semibold" : "text-purple-600 font-semibold"}>
            {isTemplateMode ? "Templates" : "Tours"}
          </span>
        </div>
        
        {/* Header */}
        <PageHeader
          title={isTemplateMode ? "Templates Management" : "Tours Management"}
          subtitle={isTemplateMode 
            ? "Manage tour templates to create reusable tour packages" 
            : "Manage active tour packages and experiences across Sri Lanka"
          }
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          )}
          action={
            isTemplateMode ? (
              <Button 
                onClick={() => navigate('/admin/templates/new')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Template
              </Button>
            ) : null
          }
        />

        {/* Stats Cards */}        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatsCard
            title={isTemplateMode ? "Active Templates" : "Active Tours"}
            value={activeTours.toString()}
            color="blue"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            )}
          />
          <StatsCard
            title={isTemplateMode ? "Template Capacity" : "Total Participants"}
            value={isTemplateMode ? relevantTours.length.toString() : totalParticipants.toString()}
            color="green"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          />
          <StatsCard
            title="Average Rating"
            value={averageRating}
            color="yellow"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(totalRevenue/1000).toFixed(1)}K`}
            color="purple"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          />
        </div>

        {/* Filters */}
        <ContentCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Tours</h3>
            </div>
          </div>
          <TourFilterBar
            searchValue={searchValue}
            onSearchChange={(e) => setSearchValue(e.target.value)}
            statusValue={statusValue}
            onStatusChange={(e) => setStatusValue(e.target.value)}
            typeValue={typeValue}
            onTypeChange={(e) => setTypeValue(e.target.value)}
          />
        </ContentCard>

        {/* Tours Table */}
        <ContentCard noPadding>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading tours...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-600 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchTours} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <TourTable 
              tours={paginated} 
              onView={handleView} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onCreateFromTemplate={handleCreateFromTemplate}
              isTemplateMode={isTemplateMode}
            />
          )}
        </ContentCard>        {/* Pagination */}
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
