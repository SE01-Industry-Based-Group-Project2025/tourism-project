import React from "react";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/ui/StatsCard";
import ContentCard from "../components/ui/ContentCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          subtitle="Welcome to the SLTOURPAL Admin Dashboard"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
        />

        {/* Stats Cards */}        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatsCard
            title="Total Tours"
            value="24"
            color="blue"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            )}
          />
          <StatsCard
            title="Active Bookings"
            value="156"
            color="green"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          />
          <StatsCard
            title="Total Revenue"
            value="$45,632"
            color="yellow"
            icon={({ className }) => (
              <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            )}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContentCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 rounded-xl transition-all duration-300 hover:shadow-md">
                <div className="p-3 bg-blue-500 rounded-xl shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Add New Tour</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 rounded-xl transition-all duration-300 hover:shadow-md">
                <div className="p-3 bg-green-500 rounded-xl shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Add Destination</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-xl transition-all duration-300 hover:shadow-md">
                <div className="p-3 bg-purple-500 rounded-xl shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">View Analytics</span>
              </button>
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">New booking received</p>
                  <p className="text-sm text-gray-600">Cultural Heritage Tour - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Payment confirmed</p>
                  <p className="text-sm text-gray-600">Booking #1234 - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-yellow-50/50 rounded-xl">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">New review submitted</p>
                  <p className="text-sm text-gray-600">5 stars for Beach Paradise - 6 hours ago</p>
                </div>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
