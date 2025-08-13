// src/features/booking/BookingCancel.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import ContentCard from '../../components/ui/ContentCard';

const BookingCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Booking Cancelled"
          subtitle="Your payment was not processed"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        />

        <div className="mt-8">
          <ContentCard>
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Cancelled
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your payment was cancelled and no charges were made. You can try booking again or browse other tours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate(-1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  Try Booking Again
                </Button>
                
                <Button
                  onClick={() => navigate('/tours')}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Browse Tours
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  If you're experiencing issues with payment or have questions about booking, 
                  please contact our support team.
                </p>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
};

export default BookingCancel;
