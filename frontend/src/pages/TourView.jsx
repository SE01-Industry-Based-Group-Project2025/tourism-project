// src/pages/TourView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import ContentCard from '../components/ui/ContentCard';
import QuickBookingCard from '../features/booking/QuickBookingCard';
import { ArrowLeft, Edit3, Trash2, MapPin, Clock, Users, Star, DollarSign } from 'lucide-react';

export default function TourView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8080';
  const TOURS_API = `${API_BASE}/api/tours`;

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${TOURS_API}/${id}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched tour:', data);
          setTour(data);
        } else {
          console.error('Failed to fetch tour:', res.status);
          setError('Failed to fetch tour details');
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Error fetching tour details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id, getAuthHeaders]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      try {
        const res = await fetch(`${TOURS_API}/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        
        if (res.ok) {
          alert('Tour deleted successfully');
          navigate('/admin/tours');
        } else {
          alert('Failed to delete tour');
        }
      } catch (err) {
        console.error('Error deleting tour:', err);
        alert('Error deleting tour');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-lg">Loading tour details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <ContentCard>
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tour</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin/tours')}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tours
                  </Button>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <ContentCard>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
                <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
                <Button 
                  onClick={() => navigate('/admin/tours')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tours
                </Button>
              </div>
            </ContentCard>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'incomplete':
      case 'ongoing':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-400/25';
      case 'completed':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-blue-400/25';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-400/25';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="p-6 space-y-8">
        {/* Header */}
        <PageHeader
          title={tour.name}
          subtitle="Tour Details"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          )}
          action={
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/tours')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </Button>
              <Button 
                onClick={() => navigate(`/admin/tours/${id}/edit`)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Tour
              </Button>
              <Button 
                onClick={handleDelete}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Tour
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <ContentCard>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{tour.shortDescription}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{tour.longDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">{tour.category?.toLowerCase()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">{tour.region?.toLowerCase()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">{tour.difficulty?.toLowerCase()}</p>
                </div>
              </div>
            </ContentCard>

            {/* Activities */}
            {tour.activities && tour.activities.length > 0 && (
              <ContentCard>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Activities</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tour.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </ContentCard>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <ContentCard>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Itinerary</h3>
                </div>
                
                <div className="space-y-4">
                  {tour.itinerary.map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Day {day.day}: {day.title}</h4>
                      <p className="text-gray-700 mb-3">{day.description}</p>
                      
                      {day.places && day.places.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-600 mb-2 block">Places to visit:</span>
                          <div className="flex flex-wrap gap-2">
                            {day.places.map((place, placeIndex) => (
                              <span
                                key={placeIndex}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300"
                              >
                                <MapPin className="w-3 h-3 mr-1" />
                                {place}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ContentCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <ContentCard>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Price</span>
                  </div>
                  <span className="font-bold text-green-600">${tour.price}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Duration</span>
                  </div>
                  <span className="font-bold text-blue-600">{tour.durationValue} {tour.durationUnit?.toLowerCase()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-700">Available Spots</span>
                  </div>
                  <span className="font-bold text-purple-600">{tour.availableSpots}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-700">Status</span>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(tour.status)}`}>
                    {tour.status?.toLowerCase()}
                  </span>
                </div>
              </div>
            </ContentCard>

            {/* Quick Booking Card for non-template tours */}
            <QuickBookingCard tour={tour} />

            {/* Meta Information */}
            <ContentCard>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Meta Information</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Tour ID</span>
                  <p className="text-gray-900 font-mono text-sm">{tour.id}</p>
                </div>
                
                {tour.createdAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Created</span>
                    <p className="text-gray-900 text-sm">{new Date(tour.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
                
                {tour.updatedAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    <p className="text-gray-900 text-sm">{new Date(tour.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </ContentCard>
          </div>
        </div>
      </div>
    </div>
  );
}
