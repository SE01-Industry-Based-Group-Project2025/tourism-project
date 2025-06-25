import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentCard from "../components/ui/ContentCard";
import StatsCard from "../components/ui/StatsCard";

export default function Reviews() {
  const [reviews] = useState([
    { 
      id: 1, 
      user: "John Doe", 
      tour: "Cultural Heritage Tour", 
      rating: 5, 
      comment: "Amazing experience! The guide was very knowledgeable and the temples were breathtaking.",
      date: "2 days ago",
      status: "Published"
    },
    { 
      id: 2, 
      user: "Sarah Wilson", 
      tour: "Beach Paradise Package", 
      rating: 4, 
      comment: "Great beaches and activities. Could use better transportation arrangements.",
      date: "1 week ago",
      status: "Published"
    },
    { 
      id: 3, 
      user: "Mike Johnson", 
      tour: "Wildlife Safari Experience", 
      rating: 5, 
      comment: "Saw elephants up close! The national park was incredible and well-organized.",
      date: "3 days ago",
      status: "Pending"
    },
  ]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
      {/* Header */}
      <PageHeader
        title="Reviews Management"
        subtitle="Monitor and manage customer reviews and ratings"
        icon={({ className }) => (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsCard
          title="Total Reviews"
          value="1,432"
          color="purple"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          )}
        />
        <StatsCard
          title="Average Rating"
          value="4.7"
          color="yellow"


          icon={({ className }) => (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        />
        <StatsCard
          title="5-Star Reviews"
          value="892"
          color="green"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
        <StatsCard
          title="Pending Reviews"
          value="23"
          color="red"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
      </div>

      {/* Reviews Table */}
      <ContentCard>        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Reviews</h3>
          </div>
          <div className="flex gap-3">
            <select className="px-6 py-3 border-2 border-purple-100 rounded-xl text-sm font-semibold bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-300 hover:shadow-xl transition-all duration-300">
              <option>All Reviews</option>
              <option>Published</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div><div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">
                        {review.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{review.user}</p>
                      <p className="text-sm font-semibold text-gray-600">{review.tour}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm font-bold text-gray-700">({review.rating}/5)</span>
                    <span className="text-sm text-gray-500">• {review.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">{review.comment}</p>
                </div>
                <div className="flex flex-col items-end gap-3 ml-6">
                  <span className={`inline-flex px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                    review.status === 'Published' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-400/25' : 
                    review.status === 'Pending' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-yellow-400/25' : 
                    'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-400/25'
                  }`}>
                    {review.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border-2 border-blue-200 hover:border-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-2 text-green-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 border-2 border-green-200 hover:border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button className="p-2 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 border-2 border-red-200 hover:border-red-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Load More Reviews
          </button>
        </div>
      </ContentCard>
      </div>
    </div>
  );
}
