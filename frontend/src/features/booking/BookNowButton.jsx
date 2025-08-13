// src/features/booking/BookNowButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

const BookNowButton = ({ tour }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isUser } = useAuth();

  // Don't show button for templates
  if (tour?.isTemplate === true) {
    return null;
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isUser) {
      alert('Only users can book tours. Please log in with a user account.');
      return;
    }

    navigate(`/book/${tour.id}`);
  };

  return (
    <Button
      onClick={handleBookNow}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Book Now - ${tour?.price || 0}
    </Button>
  );
};

export default BookNowButton;
