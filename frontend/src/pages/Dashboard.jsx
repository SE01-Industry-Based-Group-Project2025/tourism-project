import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentCard from "../components/ui/ContentCard";
import StatsCard from "../components/ui/StatsCard";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin, getAuthHeaders } = useAuth();
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // API Configuration
  const API_BASE = 'http://localhost:8080';
  const USERS_API = `${API_BASE}/api/admin/users`;

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const [allUsersRes, adminUsersRes, regularUsersRes] = await Promise.all([
        fetch(USERS_API, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        fetch(`${USERS_API}/admins`, {
          method: 'GET',
          headers: getAuthHeaders(),
        }),
        fetch(`${USERS_API}/regular-users`, {
          method: 'GET',
          headers: getAuthHeaders(),
        })
      ]);

      if (allUsersRes.ok && adminUsersRes.ok && regularUsersRes.ok) {
        const [allUsers, adminUsers, regularUsers] = await Promise.all([
          allUsersRes.json(),
          adminUsersRes.json(),
          regularUsersRes.json()
        ]);

        const activeUsers = allUsers.filter(user => user.enabled).length;

        setUserStats({
          totalUsers: allUsers.length,
          adminUsers: adminUsers.length,
          regularUsers: regularUsers.length,
          activeUsers
        });
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUserStats();
    }
  }, [isAdmin]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Admin</h1>
            <p className="text-gray-600">All systems are running smoothly! You have <span className="font-semibold text-blue-600">3 unread alerts</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-gray-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Today ({new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})
            </div>
            <div className="flex items-center text-blue-600">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1.001-.67 1.567H6a1 1 0 000 2h.013a9.358 9.358 0 000 1.966H6a1 1 0 100 2h.351c.163.566.385 1.092.67 1.567C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029C10.792 13.807 10.304 14 10 14s-.792-.193-1.264-.979a1 1 0 00-1.715 1.029z" clipRule="evenodd" />
              </svg>
              31°C Colombo
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={loading ? "..." : userStats.totalUsers.toString()}
          percentage="All registered users"
          color="blue"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        />
        <StatsCard
          title="Administrators"
          value={loading ? "..." : userStats.adminUsers.toString()}
          percentage="Admin users"
          color="purple"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
        />
        <StatsCard
          title="Regular Users"
          value={loading ? "..." : userStats.regularUsers.toString()}
          percentage="Customer accounts"
          color="green"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        />
        <StatsCard
          title="Active Users"
          value={loading ? "..." : userStats.activeUsers.toString()}
          percentage="Enabled accounts"
          color="pink"
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <div className="space-y-4">              <button 
                onClick={() => navigate('/admin/tours/new')}
                className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Add New Tour</span>
              </button>              <button 
                onClick={() => navigate('/admin/places')}
                className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Add Destination</span>
              </button>
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Manage Users</span>
              </button>
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
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
              </div>            </div>
          </ContentCard>
        </div>
    </div>
  );
}
