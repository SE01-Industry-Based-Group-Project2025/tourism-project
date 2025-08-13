import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentCard from "../components/ui/ContentCard";
import StatsCard from "../components/ui/StatsCard";
import { useAuth } from "../contexts/AuthContext";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const { getAuthHeaders } = useAuth();

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reviews/allReviews", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="p-6 space-y-8">
        {/* Header */}
        <PageHeader
          title="Reviews Management"
          subtitle="Monitor and manage customer reviews and ratings"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          )}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <StatsCard title="Total Reviews" value={reviews.length.toString()} color="purple" />
          <StatsCard title="Average Rating" value={(
            reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length || 0
          ).toFixed(1)} color="yellow" />
          <StatsCard title="5-Star Reviews" value={reviews.filter(r => r.rating === 5).length.toString()} color="green" />
          <StatsCard title="Pending Reviews" value="-" color="red" />
        </div>

        {/* Review List */}
        <ContentCard>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-br from-purple-500 to-blue-600">
                        <span className="text-lg font-bold text-white">
                          {review.userId ? `U${review.userId}` : "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">User ID: {review.userId}</p>
                        <p className="text-sm font-semibold text-gray-600">Tour ID: {review.tourId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-bold text-gray-700">({review.rating}/5)</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
