import React, { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentCard from "../components/ui/ContentCard";
import StatsCard from "../components/ui/StatsCard";

export default function QuoteRequests() {
  const [requests] = useState([
    {
      id: "QR-001",
      customer: "Alice Johnson",
      email: "alice@example.com",
      tour: "Cultural Heritage Tour",
      travelers: 4,
      budget: "$5,000",
      dates: "July 15-22, 2025",
      status: "Pending",
      submitted: "2 hours ago",
      notes: "Looking for family-friendly activities and vegetarian meal options."
    },
    {
      id: "QR-002", 
      customer: "Robert Chen",
      email: "robert@example.com",
      tour: "Adventure Mountain Trek",
      travelers: 2,
      budget: "$3,500",
      dates: "August 10-14, 2025",
      status: "Quoted",
      submitted: "1 day ago",
      notes: "Experienced hikers, interested in challenging routes."
    },
    {
      id: "QR-003",
      customer: "Maria Garcia",
      email: "maria@example.com", 
      tour: "Beach Paradise Package",
      travelers: 6,
      budget: "$8,000",
      dates: "September 5-12, 2025",
      status: "Confirmed",
      submitted: "3 days ago",
      notes: "Celebration trip for anniversary, need luxury accommodations."
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Quoted': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
      {/* Header */}
      <PageHeader
        title="Quote Requests"
        subtitle="Manage and respond to customer quote requests"
        icon={({ className }) => (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        iconColor="text-yellow-600"
        iconBgColor="bg-yellow-100"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsCard
          title="Total Requests"
          value="147"
          color="yellow"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        />
        <StatsCard
          title="Pending Quotes"
          value="34"
          color="blue"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
        <StatsCard
          title="Conversion Rate"
          value="68.5%"
          color="green"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
        <StatsCard
          title="Avg. Response Time"
          value="4.2h"
          color="purple"


          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        />
      </div>

      {/* Quote Requests Table */}
      <ContentCard>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Quote Requests</h3>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option>All Requests</option>
              <option>Pending</option>
              <option>Quoted</option>
              <option>Confirmed</option>
              <option>Rejected</option>
            </select>
            <button className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-gray-500">{request.id}</span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-400">{request.submitted}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{request.customer}</h4>
                  <p className="text-sm text-gray-600 mb-2">{request.email}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Send Quote
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Tour Package</p>
                  <p className="font-medium text-gray-900">{request.tour}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Travelers</p>
                  <p className="font-medium text-gray-900">{request.travelers} people</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="font-medium text-gray-900">{request.budget}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Travel Dates</p>
                  <p className="font-medium text-gray-900">{request.dates}</p>
                </div>
              </div>

              {request.notes && (
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Special Requirements</p>
                  <p className="text-sm text-gray-700">{request.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors">
            Load More Requests          </button>
        </div>
      </ContentCard>
      </div>
    </div>
  );
}
