// src/pages/TouristDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaHeart, FaUser, FaCog, FaSignOutAlt, FaSearch, FaFilter, FaClock, FaUsers } from 'react-icons/fa';

export default function TouristDashboard() {
  const { user, logout } = useAuth();
  const { state } = useLocation();
  const banner = state?.loginMsg;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

  // Mock data for demonstration
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

  const [allTours] = useState([
    {
      id: 1,
      title: "Sigiriya & Dambulla Day Tour",
      price: 85,
      rating: 4.8,
      reviews: 156,
      duration: "1 Day",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      highlights: ["Ancient Rock Fortress", "Cave Temples", "Local Lunch"],
      description: "Explore ancient Sri Lankan heritage sites with expert guides."
    },
    {
      id: 2,
      title: "Ella Hiking Adventure",
      price: 120,
      rating: 4.9,
      reviews: 203,
      duration: "2 Days",
      category: "Adventure",
      image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=400",
      highlights: ["Nine Arch Bridge", "Little Adam's Peak", "Tea Plantations"],
      description: "Mountain hiking and scenic railway experiences in Ella."
    },
    {
      id: 3,
      title: "Yala Safari Experience",
      price: 95,
      rating: 4.7,
      reviews: 89,
      duration: "1 Day",
      category: "Wildlife",
      image: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400",
      highlights: ["Wildlife Safari", "Leopard Spotting", "Bird Watching"],
      description: "Ultimate wildlife safari experience in Yala National Park."
    },
    {
      id: 4,
      title: "Mirissa Beach & Whale Watching",
      price: 75,
      rating: 4.6,
      reviews: 124,
      duration: "1 Day",
      category: "Beach",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
      highlights: ["Whale Watching", "Beach Relaxation", "Fresh Seafood"],
      description: "Marine life adventure with pristine beach experience."
    },
    {
      id: 5,
      title: "Kandy Cultural Heritage Tour",
      price: 65,
      rating: 4.5,
      reviews: 98,
      duration: "1 Day",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      highlights: ["Temple of Tooth", "Royal Palace", "Cultural Dance"],
      description: "Immerse in Kandy's rich cultural and religious heritage."
    }
  ]);

  // Filter tours based on search criteria
  const filteredTours = allTours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.highlights.some(highlight => 
                           highlight.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === '' || tour.category === selectedCategory;
    const matchesDuration = selectedDuration === '' || tour.duration === selectedDuration;
    
    return matchesSearch && matchesCategory && matchesDuration;
  });

  // Get recommended tours (subset for dashboard)
  const recommendedTours = allTours.slice(0, 3);

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
            <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-200">
              <div className="relative">
                <img src={tour.image} alt={tour.title} className="w-full h-48 object-cover" />
                <div className="absolute top-3 right-3">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                    <FaHeart className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">{tour.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{tour.rating} ({tour.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FaClock className="mr-1" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {tour.highlights.slice(0, 2).map((highlight, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${tour.price}</span>
                  <button
                    onClick={() => setActiveTab('tour-details')}
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

  const renderBookingsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Bookings History</h2>
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

      {/* Upcoming Trips in Bookings */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Trips</h2>
        <div className="space-y-4">
          {upcomingTrips.map(trip => (
            <div key={trip.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <img src={trip.image} alt={trip.title} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{trip.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>📅 {trip.date}</span>
                  <span>⏱️ {trip.duration}</span>
                  <span>👨‍🦱 {trip.guide}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">${trip.price}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {trip.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
        <h2 className="text-xl font-bold text-gray-800 mb-6">Available Tours</h2>
        
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
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map(tour => (
              <div key={tour.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-200">
                <div className="relative">
                  <img src={tour.image} alt={tour.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition duration-200">
                      <FaHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                      {tour.category}
                    </span>
                  </div>
                  {tour.rating >= 4.8 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                        <FaStar className="mr-1" />
                        Top Rated
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">{tour.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tour.description}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{tour.rating} ({tour.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <FaClock className="mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tour.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {tour.highlights.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{tour.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">${tour.price}</span>
                    <button
                      onClick={() => setActiveTab('tour-details')}
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tours found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or browse all available tours
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDuration('');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Show All Tours
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
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Plan Your Custom Tour</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Preferred Start Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Duration (Days)</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1-2 Days</option>
                <option>3-5 Days</option>
                <option>1 Week</option>
                <option>2 Weeks</option>
                <option>1 Month+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Interests (Select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Cultural Sites', 'Wildlife Safari', 'Beach Activities', 'Adventure Sports', 'Tea Plantations', 'Local Cuisine', 'Photography', 'Spiritual Tours'].map((interest, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Budget Range (Per Person)</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>$50 - $100</option>
                <option>$100 - $200</option>
                <option>$200 - $500</option>
                <option>$500+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Group Size</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1-2 People</option>
                <option>3-5 People</option>
                <option>6-10 People</option>
                <option>10+ People</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Special Requirements</label>
            <textarea
              rows={4}
              placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or specific places you'd like to visit..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            >
              Submit Custom Tour Request
            </button>
          </div>
        </form>
      </div>
    </div>
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
    </div>
  );
}
