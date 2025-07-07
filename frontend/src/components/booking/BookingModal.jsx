// src/components/booking/BookingModal.jsx

import React, { useState } from 'react';

export default function BookingModal({ tour, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking data:', { tour, ...formData });
    alert('Booking request submitted! We will contact you soon.');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      checkInDate: '',
      checkOutDate: '',
      adults: 1,
      children: 0,
      specialRequests: '',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    });
    setStep(1);
  };

  const totalPrice = (formData.adults * tour?.price || 0) + (formData.children * (tour?.price * 0.7 || 0));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            Book Your Tour
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tour Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <img
              src={tour?.imageUrl}
              alt={tour?.title}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-800">{tour?.title}</h3>
              <p className="text-sm text-gray-600">{tour?.duration} days • ${tour?.price} per person</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults
                  </label>
                  <select
                    name="adults"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children (0-12 years)
                  </label>
                  <select
                    name="children"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  >
                    {[0,1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  placeholder="Any special dietary requirements, accessibility needs, or preferences..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-maroon text-white rounded-lg hover:bg-red-800 transition-colors duration-300"
                >
                  Next: Contact Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Adults ({formData.adults})</span>
                    <span>${(formData.adults * tour?.price || 0).toLocaleString()}</span>
                  </div>
                  {formData.children > 0 && (
                    <div className="flex justify-between">
                      <span>Children ({formData.children})</span>
                      <span>${(formData.children * (tour?.price * 0.7 || 0)).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2 font-semibold">
                    <div className="flex justify-between text-lg">
                      <span>Total</span>
                      <span className="text-maroon">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-maroon text-white rounded-lg hover:bg-red-800 transition-colors duration-300"
                >
                  Submit Booking Request
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
