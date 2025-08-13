// src/pages/TouristDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTours } from '../contexts/ToursContext';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaHeart, FaUser, FaCog, FaSignOutAlt, FaSearch, FaFilter, FaClock, FaUsers } from 'react-icons/fa';
import TourDetailsModal from '../components/tours/TourDetailsModal';
import AddNewTour from '../components/tours/AddNewTour';
import ReceiptLink from '../components/ui/ReceiptLink';

export default function TouristDashboard() {
  const { user, token, logout } = useAuth();
  const { tours, loading, error, fetchUpcomingTours, searchTours } = useTours();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const banner = state?.loginMsg;
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Check for tab query parameter on component mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'bookings', 'tours', 'profile'].includes(tabParam)) {
      console.log('📍 Setting active tab from URL parameter:', tabParam);
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  // Debug activeTab changes
  useEffect(() => {
    console.log('📍 Active tab changed to:', activeTab);
  }, [activeTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  // Load tours on component mount
  useEffect(() => {
    const loadTours = async () => {
      console.log('🔄 Loading tours in TouristDashboard...');
      const result = await fetchUpcomingTours();
      if (result.success) {
        console.log('✅ Loaded tours:', result.data);
        console.log('📊 Total tours received:', result.data.length);
        console.log('📊 All unique statuses:', [...new Set(result.data.map(tour => tour.status))]);
        console.log('📊 Tours with Upcoming status:', result.data.filter(tour => 
          (tour.status || '').toLowerCase() === 'upcoming'
        ));
      } else {
        console.error('❌ Failed to load tours:', result.error);
      }
    };
    loadTours();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      duration: selectedDuration
    };
    
    searchTours(filters);
  }, [searchTerm, selectedCategory, selectedDuration]);

  // Mock data for other sections (will be replaced with API later)
  const [userStats] = useState({
    totalBookings: 5,
    upcomingTrips: 2,
    favoriteDestinations: 8,
    reviewsGiven: 12
  });

  const [upcomingTrips] = useState([
    {
      id: 1,
      title: "Kandy Cultural Tour",
      date: "2025-07-15",
      duration: "3 Days",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      guide: "Saman Perera",
      price: 150
    },
    {
      id: 2,
      title: "Galle Fort & Beach Experience",
      date: "2025-08-20",
      duration: "2 Days",
      status: "Pending",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400",
      guide: "Nimal Silva",
      price: 120
    }
  ]);

  // Filter tours based on search criteria (now using API data) - Only show Upcoming tours
  const filteredTours = tours.filter(tour => {
    // First check if tour status is "Upcoming" (case-insensitive)
    const isUpcoming = (tour.status || '').toLowerCase() === 'upcoming';
    
    const matchesSearch = searchTerm === '' || 
      (tour.title || tour.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.highlights || tour.activities || []).some(highlight => 
        highlight.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === '' || 
      (tour.category || tour.tourType || '').toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesDuration = selectedDuration === '' || 
      (tour.duration || '').includes(selectedDuration);
    
    // Only return tours that are Upcoming AND match other filters
    return isUpcoming && matchesSearch && matchesCategory && matchesDuration;
  });

  // Get recommended tours (subset for dashboard) - Only Upcoming tours
  const recommendedTours = tours
    .filter(tour => (tour.status || '').toLowerCase() === 'upcoming')
    .slice(0, 3);

  const handleTourClick = (tourId) => {
    setSelectedTourId(tourId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTourId(null);
  };

  const [recentBookings] = useState([
    {
      id: 1,
      title: "Colombo City Tour",
      date: "2025-06-10",
      status: "Completed",
      rating: 5,
      amount: 45
    },
    {
      id: 2,
      title: "Negombo Beach Day",
      date: "2025-05-28",
      status: "Completed", 
      rating: 4,
      amount: 35
    },
    {
      id: 3,
      title: "Nuwara Eliya Tea Tour",
      date: "2025-06-05",
      status: "Completed",
      rating: 5,
      amount: 75
    }
  ]);

  // Real bookings data
  const [realBookings, setRealBookings] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    console.log('🔄 useEffect triggered - activeTab:', activeTab, 'token exists:', !!token);
    
    if (activeTab === 'bookings' && token) {
      console.log('✅ Conditions met - fetching bookings');
      const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
          console.log('🔄 Fetching bookings for user:', user?.email);
          
          const [bookingsRes, customRes] = await Promise.all([
            fetch('http://localhost:8080/api/bookings/my-bookings', {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }),
            fetch('http://localhost:8080/api/tours/my-custom-tours', {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
          ]);

          console.log('✅ Bookings response status:', bookingsRes.status);
          console.log('✅ Custom requests response status:', customRes.status);

          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            console.log('✅ Bookings data:', bookingsData);
            console.log('✅ Bookings content array:', bookingsData.content);
            console.log('✅ Number of bookings found:', bookingsData.content?.length || 0);
            console.log('✅ First booking structure:', bookingsData.content?.[0]);
            // Extract the content array from the paginated response
            setRealBookings(bookingsData.content || []);
          }
          
          if (customRes.ok) {
            const customData = await customRes.json();
            console.log('✅ Custom requests data:', customData);
            console.log('✅ Number of custom requests found:', customData.length);
            console.log('✅ Raw custom data structure:', JSON.stringify(customData, null, 2));
            
            // Filter for custom tours - handle different field names and values
            const customTours = Array.isArray(customData) ? customData.filter(tour => {
              // Check for different possible field names and values
              const isCustom = tour.is_custom === 1 || 
                              tour.is_custom === true || 
                              tour.isCustom === true || 
                              tour.category === "Custom Tour Request";
              console.log('🔍 Tour:', tour.name, 'isCustom check:', {
                is_custom: tour.is_custom,
                isCustom: tour.isCustom,
                category: tour.category,
                result: isCustom
              });
              return isCustom;
            }) : customData;
            console.log('✅ Filtered custom tours:', customTours);
            console.log('✅ Setting customRequests to:', customTours.length, 'items');
            
            setCustomRequests(customTours);
          } else {
            console.error('❌ Failed to fetch custom requests:', customRes.status, customRes.statusText);
          }
        } catch (error) {
          console.error('❌ Error fetching bookings:', error);
        } finally {
          setBookingsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [activeTab, token]);

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'Traveler'}! 🌴</h1>
        <p className="text-blue-100 mb-4">Ready for your next Sri Lankan adventure?</p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('tours')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
          >
            Explore Tours
          </button>
          <button
            onClick={() => setActiveTab('custom-tour')}
            className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition duration-200"
          >
            Custom Trip
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{userStats.totalBookings}</p>
            </div>
            <FaCalendarAlt className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming Trips</p>
              <p className="text-2xl font-bold text-gray-800">{userStats.upcomingTrips}</p>
            </div>
            <FaPlane className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Favorites</p>
              <p className="text-2xl font-bold text-gray-800">{userStats.favoriteDestinations}</p>
            </div>
            <FaHeart className="text-red-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Reviews Given</p>
              <p className="text-2xl font-bold text-gray-800">{userStats.reviewsGiven}</p>
            </div>
            <FaStar className="text-yellow-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Trips</h2>
          <button 
            onClick={() => setActiveTab('bookings')} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </button>
        </div>
        {upcomingTrips.length > 0 ? (
          <div className="space-y-4">
            {upcomingTrips.map(trip => (
              <div key={trip.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-200">
                <img src={trip.image} alt={trip.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{trip.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      <span>{trip.date}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      <span>{trip.guide}</span>
                    </div>
                  </div>
                  <p className="text-blue-600 font-semibold mt-1">${trip.price}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No upcoming trips yet</p>
            <p className="text-gray-400 mb-4">Start planning your adventure!</p>
            <button
              onClick={() => setActiveTab('tours')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Browse Tours
            </button>
          </div>
        )}
      </div>

      {/* Recommended Tours */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
          <button 
            onClick={() => setActiveTab('tours')} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Tours
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedTours.map(tour => (
            <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer"
                 onClick={() => handleTourClick(tour.id)}>
              <div className="relative">
                <img 
                  src={tour.imageUrl || tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} 
                  alt={tour.title || tour.name} 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute top-3 right-3">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                          onClick={(e) => e.stopPropagation()}>
                    <FaHeart className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">{tour.title || tour.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{tour.rating || 4.5} ({tour.reviewCount || tour.reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaClock className="mr-1" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(tour.highlights || tour.activities || []).slice(0, 2).map((highlight, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${tour.price || tour.cost || 0}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTourClick(tour.id);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Plan a Custom Tour</h3>
          <p className="text-green-100 mb-4">Tell us your preferences and we'll create a personalized itinerary</p>
          <button
            onClick={() => setActiveTab('custom-tour')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition duration-200"
          >
            Start Planning
          </button>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Get Travel Tips</h3>
          <p className="text-purple-100 mb-4">Discover insider tips and local insights for your Sri Lankan journey</p>
          <button
            onClick={() => setActiveTab('travel-guide')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition duration-200"
          >
            Read Guide
          </button>
        </div>
      </div>
    </div>
  );

  const renderBookingsContent = () => {
    if (bookingsLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading bookings...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Real Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Tour Bookings</h2>
          {(() => {
            console.log('🎯 Rendering bookings - realBookings length:', realBookings.length);
            console.log('🎯 Rendering bookings - realBookings content:', realBookings);
            return null;
          })()}
          {realBookings.length > 0 ? (
            <div className="space-y-4">
              {realBookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                  onClick={() => {
                    setSelectedTourId(booking.tourId);
                    setShowTourModal(true);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                        {booking.tourName || booking.title || booking.name}
                      </h3>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm flex items-center mt-1">
                      <FaCalendarAlt className="mr-1" />
                      {booking.selectedDate || booking.date || new Date(booking.createdAt || booking.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      Guests: {booking.guestCount || 1} • Booking #{booking.id}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-blue-600 text-xs group-hover:text-blue-700">
                        Click to view tour details →
                      </p>
                      {(() => {
                        const hasReceipt = booking?.status === 'CONFIRMED' && booking?.payment?.receiptUrl;
                        if (hasReceipt) {
                          return (
                            <div onClick={(e) => e.stopPropagation()}>
                              <ReceiptLink url={booking.payment.receiptUrl} size="sm" />
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">${booking.totalAmount || booking.amount || booking.price}</p>
                    <span className="text-green-600 text-sm font-medium">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings found.</p>
              <button onClick={() => setActiveTab('tours')} className="text-blue-600 hover:text-blue-800 mt-2">
                Browse available tours
              </button>
            </div>
          )}
        </div>

        {/* Custom Requests */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Custom Tour Requests</h2>
          {customRequests.length > 0 ? (
            <div className="space-y-4">
              {customRequests.map(request => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200 bg-white">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="font-bold text-gray-800 text-xl">{request.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (request.status || '').toLowerCase().includes('approved') || (request.status || '').toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-800' :
                          (request.status || '').toLowerCase().includes('pending') ? 'bg-yellow-100 text-yellow-800' :
                          (request.status || '').toLowerCase().includes('rejected') || (request.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status?.replace('_', ' ') || 'Pending Approval'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-blue-500 text-sm" />
                            <span className="font-semibold text-gray-700">Duration:</span>
                            <span className="text-gray-600">{request.duration || (request.durationValue ? `${request.durationValue} ${request.durationUnit}` : 'Not specified')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500 text-sm">💰</span>
                            <span className="font-semibold text-gray-700">Budget:</span>
                            <span className="text-gray-600">${request.budget || request.price || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-purple-500 text-sm" />
                            <span className="font-semibold text-gray-700">Group Size:</span>
                            <span className="text-gray-600">{request.group_size || request.availableSpots || 'Not specified'} people</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500 text-sm" />
                            <span className="font-semibold text-gray-700">Region:</span>
                            <span className="text-gray-600">{request.region || 'Not specified'}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500 text-sm" />
                            <span className="font-semibold text-gray-700">Requested:</span>
                            <span className="text-gray-600">{new Date(request.created_at || request.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-500 text-sm">📞</span>
                            <span className="font-semibold text-gray-700">Phone:</span>
                            <span className="text-gray-600">{request.phone || request.createdBy?.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500 text-sm">📧</span>
                            <span className="font-semibold text-gray-700">Email:</span>
                            <span className="text-gray-600">{request.email || request.createdBy?.email || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500 text-sm">🏷️</span>
                            <span className="font-semibold text-gray-700">Type:</span>
                            <span className="text-gray-600">{request.category || 'Custom Tour'}</span>
                          </div>
                        </div>
                      </div>

                      {(request.requirements || request.shortDescription) && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span>
                            Description & Requirements
                          </h4>
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                            <p className="text-gray-700 leading-relaxed">{request.requirements || request.shortDescription}</p>
                          </div>
                        </div>
                      )}

                      {(request.activities && request.activities.length > 0) && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="text-green-500">🎯</span>
                            Selected Activities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {request.activities.map((activity, index) => (
                              <span key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium border border-blue-300 shadow-sm">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {request.admin_response && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-semibold text-blue-800 mb-2">Admin Response:</p>
                      <p className="text-blue-700">{request.admin_response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No custom requests found.</p>
              <button onClick={() => setActiveTab('custom-tour')} className="text-blue-600 hover:text-blue-800 mt-2">
                Create custom request
              </button>
            </div>
          )}
        </div>

        {/* Mock Data Fallback */}
        {realBookings.length === 0 && customRequests.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Bookings (Demo)</h2>
            <div className="space-y-4">
              {recentBookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{booking.title}</h3>
                    <p className="text-gray-600 text-sm flex items-center mt-1">
                      <FaCalendarAlt className="mr-1" />
                      {booking.date}
                    </p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < booking.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">Your Rating</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">${booking.amount}</p>
                    <span className="text-green-600 text-sm font-medium">{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfileContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              value={user?.firstName || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={user?.lastName || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={user?.phone || 'Not provided'}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Member Since</label>
            <input
              type="text"
              value="June 2024"
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Preferred Language</label>
            <input
              type="text"
              value="English"
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Travel Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Favorite Activities</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Cultural Tours</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Wildlife Safari</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Beach Activities</span>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Budget Range</h4>
            <p className="text-green-700 mt-2">$50 - $200 per day</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderToursContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Available Tours</h2>
            <p className="text-sm text-gray-600 mt-1">Showing only upcoming tours available for booking</p>
          </div>
          <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
            📅 Upcoming Only
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Tours</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by destination, activity, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                >
                  <option value="">All Categories</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Beach">Beach</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                >
                  <option value="">Any Duration</option>
                  <option value="Half Day">Half Day</option>
                  <option value="1 Day">1 Day</option>
                  <option value="2 Days">2 Days</option>
                  <option value="3 Days">3 Days</option>
                  <option value="5 Days">5 Days</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Filter Summary */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">
              {filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'} found
            </span>
            {(searchTerm || selectedCategory || selectedDuration) && (
              <>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedDuration('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </>
            )}
          </div>
          
          {/* Active Filters */}
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-2 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedDuration && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                {selectedDuration}
                <button
                  onClick={() => setSelectedDuration('')}
                  className="ml-2 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading tours...</span>
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map(tour => (
              <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer"
                   onClick={() => handleTourClick(tour.id)}>
                <div className="relative">
                  <img 
                    src={tour.imageUrl || tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} 
                    alt={tour.title || tour.name} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute top-3 right-3">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition duration-200"
                            onClick={(e) => e.stopPropagation()}>
                      <FaHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                      {tour.category || tour.tourType || 'Tour'}
                    </span>
                  </div>
                  {(tour.rating || 4.5) >= 4.8 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                        <FaStar className="mr-1" />
                        Top Rated
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">{tour.title || tour.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tour.description || 'Experience the best of Sri Lanka with this tour.'}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{tour.rating || 4.5} ({tour.reviewCount || tour.reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <FaClock className="mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(tour.highlights || tour.activities || []).slice(0, 2).map((highlight, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {(tour.highlights || tour.activities || []).length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{(tour.highlights || tour.activities || []).length - 2} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">${tour.price || tour.cost || 0}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTourClick(tour.id);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error ? 'Error loading tours' : 'No upcoming tours found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {error ? error : 'No upcoming tours match your search criteria. Try adjusting your filters or check back later for new tours.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDuration('');
                if (error) {
                  fetchUpcomingTours();
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {error ? 'Retry' : 'Show All Upcoming Tours'}
            </button>
          </div>
        )}

        {/* Quick Filter Buttons */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Categories</h3>
          <div className="flex flex-wrap gap-3">
            {['Cultural', 'Adventure', 'Wildlife', 'Beach'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                className={`px-4 py-2 rounded-lg border transition duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomTourContent = () => (
    <AddNewTour 
      mode="tourist" 
      onClose={() => setActiveTab('dashboard')} 
    />
  );

  const renderTourDetailsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setActiveTab('tours')}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back to Tours
          </button>
          <h2 className="text-xl font-bold text-gray-800">Tour Details</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600"
              alt="Tour Image"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sigiriya & Dambulla Day Tour</h3>
            <div className="flex items-center text-gray-600 mb-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span>4.8 (156 reviews)</span>
              <span className="mx-3">•</span>
              <FaClock className="mr-1" />
              <span>1 Day</span>
            </div>
            <p className="text-gray-700 mb-6">
              Explore the ancient wonders of Sri Lanka with our expertly guided tour to Sigiriya Rock Fortress 
              and Dambulla Cave Temples. This full-day adventure combines history, culture, and breathtaking views.
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>✅ Professional English-speaking guide</li>
              <li>✅ Air-conditioned transportation</li>
              <li>✅ Entrance fees to all attractions</li>
              <li>✅ Traditional Sri Lankan lunch</li>
              <li>✅ Bottled water throughout the tour</li>
            </ul>
          </div>
          
          <div>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">$85</div>
              <p className="text-gray-600 mb-4">per person</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Number of People</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1 Person</option>
                    <option>2 People</option>
                    <option>3 People</option>
                    <option>4 People</option>
                    <option>5+ People</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
                Book Now
              </button>
              
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800">
                  <FaHeart className="inline mr-1" />
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTravelGuideContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sri Lanka Travel Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🌟 Must-Visit Destinations</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Sigiriya Rock Fortress</li>
              <li>• Kandy Temple of the Tooth</li>
              <li>• Galle Dutch Fort</li>
              <li>• Ella Nine Arch Bridge</li>
              <li>• Yala National Park</li>
              <li>• Nuwara Eliya Tea Plantations</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">🍛 Local Cuisine</h3>
            <ul className="space-y-2 text-green-700">
              <li>• Rice & Curry (Traditional meal)</li>
              <li>• Hoppers (Bowl-shaped pancakes)</li>
              <li>• Kottu Roti (Chopped roti stir-fry)</li>
              <li>• Fish Curry</li>
              <li>• Ceylon Tea</li>
              <li>• King Coconut Water</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">🎒 Packing Tips</h3>
            <ul className="space-y-2 text-yellow-700">
              <li>• Light, breathable clothing</li>
              <li>• Comfortable walking shoes</li>
              <li>• Sunscreen & hat</li>
              <li>• Insect repellent</li>
              <li>• Light rain jacket</li>
              <li>• Camera with extra batteries</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3">💡 Travel Tips</h3>
            <ul className="space-y-2 text-purple-700">
              <li>• Best time: December to March</li>
              <li>• Currency: Sri Lankan Rupee</li>
              <li>• Tipping: 10% at restaurants</li>
              <li>• Language: Sinhala, Tamil, English</li>
              <li>• Dress modestly at temples</li>
              <li>• Remove shoes before entering temples</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📞 Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Police:</strong> 119
            </div>
            <div>
              <strong>Tourist Helpline:</strong> 1912
            </div>
            <div>
              <strong>Hospital:</strong> 110
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://www.sltourpal.com/img/logo_letters.png"
                className="h-8"
                alt="SLTourPal logo"
              />
              <span className="text-xl font-bold text-gray-800">SLTourPal</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`font-medium transition duration-200 ${
                  activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`font-medium transition duration-200 ${
                  activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('tours')}
                className={`font-medium transition duration-200 ${
                  activeTab === 'tours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Browse Tours
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`font-medium transition duration-200 ${
                  activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Profile
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {user?.firstName?.charAt(0) || 'T'}
                </div>
                <span className="text-sm font-medium">{user?.firstName}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition duration-200"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {banner && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            ✅ {banner}
          </div>
        )}

        {activeTab === 'dashboard' && renderDashboardContent()}
        {activeTab === 'bookings' && renderBookingsContent()}
        {activeTab === 'tours' && renderToursContent()}
        {activeTab === 'custom-tour' && renderCustomTourContent()}
        {activeTab === 'tour-details' && renderTourDetailsContent()}
        {activeTab === 'travel-guide' && renderTravelGuideContent()}
        {activeTab === 'profile' && renderProfileContent()}
      </main>

      {/* Tour Details Modal */}
      <TourDetailsModal
        tourId={selectedTourId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Tour Details Modal for Bookings */}
      <TourDetailsModal
        tourId={selectedTourId}
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
      />
    </div>
  );
}
