// src/components/tours/TourDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import { useTours } from '../../contexts/ToursContext';
import { FaTimes, FaStar, FaClock, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaHeart, FaShare } from 'react-icons/fa';

export default function TourDetailsModal({ tourId, isOpen, onClose }) {
  const { fetchTourById, loading } = useTours();
  const [tour, setTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && tourId) {
      loadTourDetails();
    }
  }, [isOpen, tourId]);

  const loadTourDetails = async () => {
    const result = await fetchTourById(tourId);
    if (result.success) {
      setTour(result.data);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookNow = () => {
    // Implement booking logic here
    alert('Booking functionality to be implemented');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tour ? (
          <>
            {/* Header */}
            <div className="relative">
              <img
                src={tour.imageUrl || tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                alt={tour.title || tour.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white">
                  <h1 className="text-2xl font-bold mb-2">{tour.title || tour.name}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{tour.rating || 4.5} ({tour.reviewCount || tour.reviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{tour.location || tour.destinations?.[0] || 'Sri Lanka'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'itinerary'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'pricing'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Pricing
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">About This Tour</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {tour.description || 'Experience the best of Sri Lanka with this carefully crafted tour package.'}
                        </p>
                      </div>

                      {/* Highlights */}
                      {(tour.highlights || tour.activities) && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">Highlights</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(tour.highlights || tour.activities || []).map((highlight, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-gray-700">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* What's Included */}
                      {tour.included && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">What's Included</h3>
                          <div className="space-y-2">
                            {tour.included.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* What's Not Included */}
                      {tour.excluded && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">What's Not Included</h3>
                          <div className="space-y-2">
                            {tour.excluded.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="text-red-600">❌</span>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'itinerary' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Itinerary</h3>
                      {tour.itinerary && tour.itinerary.length > 0 ? (
                        <div className="space-y-4">
                          {tour.itinerary.map((day, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Day {day.day || index + 1}: {day.title}
                              </h4>
                              <p className="text-gray-700 mb-3">{day.description}</p>
                              {day.activities && (
                                <div className="space-y-1">
                                  <h5 className="font-medium text-gray-800">Activities:</h5>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {day.activities.map((activity, actIndex) => (
                                      <li key={actIndex}>{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {day.meals && (
                                <div className="mt-3 text-sm text-gray-600">
                                  <strong>Meals:</strong> {day.meals.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Detailed itinerary information will be provided upon booking.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing Details</h3>
                      
                      {/* Main Pricing */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            ${tour.price || tour.cost || 0}
                          </div>
                          <p className="text-gray-600">per person</p>
                        </div>
                      </div>

                      {/* Group Pricing */}
                      {tour.groupPricing && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Group Pricing</h4>
                          <div className="space-y-2">
                            {tour.groupPricing.map((pricing, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>{pricing.groupSize}</span>
                                <span className="font-semibold">${pricing.pricePerPerson}/person</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Costs */}
                      {tour.additionalCosts && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Additional Costs</h4>
                          <div className="space-y-2">
                            {tour.additionalCosts.map((cost, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>{cost.item}</span>
                                <span className="font-semibold">${cost.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        ${tour.price || tour.cost || 0}
                      </div>
                      <p className="text-gray-600">per person</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of People
                        </label>
                        <select
                          value={selectedPeople}
                          onChange={(e) => setSelectedPeople(parseInt(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-700">Total Cost:</span>
                          <span className="text-xl font-bold text-gray-800">
                            ${((tour.price || tour.cost || 0) * selectedPeople).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleBookNow}
                        disabled={!selectedDate}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 font-semibold"
                      >
                        Book Now
                      </button>

                      <div className="flex items-center justify-center space-x-4 mt-4">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                          <FaHeart />
                          <span>Add to Wishlist</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <FaShare />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Tour details not available</p>
          </div>
        )}
      </div>
    </div>
  );
}
