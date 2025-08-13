// src/features/admin/analytics/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/feedback/useToast';
import PageHeader from '../../../components/ui/PageHeader';
import ContentCard from '../../../components/ui/ContentCard';
import { Button } from '../../../components/ui/Button';
import MiniCards from './components/MiniCards';
import SimpleLineChart from './components/SimpleLineChart';
import StatusPill from './components/StatusPill';

import { 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Users,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const toast = useToast();

  // State
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:8080';

  // Fetch dashboard summary
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch dashboard summary
      const dashboardResponse = await fetch(`${API_BASE}/api/admin/analytics/dashboard`, {
        headers: getAuthHeaders(),
      });

      if (!dashboardResponse.ok) {
        if (dashboardResponse.status === 401 || dashboardResponse.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(`Failed to fetch dashboard data: ${dashboardResponse.status}`);
      }

      const dashboard = await dashboardResponse.json();
      setDashboardData(dashboard);

      // Fetch revenue data for mini chart
      try {
        const revenueResponse = await fetch(`${API_BASE}/api/admin/analytics/revenue/monthly`, {
          headers: getAuthHeaders(),
        });
        
        if (revenueResponse.ok) {
          const revenue = await revenueResponse.json();
          setRevenueData(Array.isArray(revenue) ? revenue.slice(-6) : []); // Last 6 months
        }
      } catch (err) {
        console.warn('Failed to fetch revenue data for chart:', err);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '—';
    return `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Prepare KPI cards
  const kpiCards = dashboardData ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData.totalRevenue),
      subtext: 'All time',
      trend: dashboardData.monthOverMonthTrend,
      icon: DollarSign
    },
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings?.toLocaleString() || '0',
      subtext: 'All time',
      icon: Calendar
    },
    {
      title: 'Confirmed Rate',
      value: dashboardData.confirmedRate ? `${(dashboardData.confirmedRate * 100).toFixed(1)}%` : '—',
      subtext: 'Success rate',
      icon: CheckCircle
    },
    {
      title: 'Active Customers',
      value: dashboardData.activeCustomers?.toLocaleString() || '0',
      subtext: 'This month',
      icon: Users
    }
  ] : [];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <PageHeader 
            title="Analytics Dashboard"
            subtitle="Business insights and performance metrics"
          />
          <ContentCard>
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">Error loading analytics</div>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchDashboardData}>
                Try Again
              </Button>
            </div>
          </ContentCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Analytics Dashboard"
          subtitle="Business insights and performance metrics"
        />

        <div className="space-y-6">
          {/* KPI Cards */}
          <MiniCards cards={kpiCards} loading={loading} />

          {/* Charts and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <ContentCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                  <p className="text-sm text-gray-600">Last 6 months</p>
                </div>
                <Button
                  onClick={() => navigate('/admin/analytics/revenue')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ) : revenueData.length > 0 ? (
                <SimpleLineChart
                  data={revenueData.map(item => ({
                    x: item.month,
                    y: item.revenue
                  }))}
                  width={400}
                  height={200}
                  xKey="x"
                  yKey="y"
                  color="#3B82F6"
                  className="w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">No revenue data available</span>
                </div>
              )}
            </ContentCard>

            {/* Top Tour */}
            <ContentCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Tour</h3>
                  <p className="text-sm text-gray-600">Highest revenue generator</p>
                </div>
                <Button
                  onClick={() => navigate('/admin/analytics/tours')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : dashboardData?.topTourName ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{dashboardData.topTourName}</h4>
                      <p className="text-sm text-gray-600">Featured tour</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(dashboardData.topTourRevenue)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <StatusPill value="TOP" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">No tour data available</span>
                </div>
              )}
            </ContentCard>
          </div>

          {/* Quick Links */}
          <ContentCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate('/admin/analytics/revenue')}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <DollarSign className="h-5 w-5" />
                <span>Revenue</span>
              </Button>
              
              <Button
                onClick={() => navigate('/admin/analytics/tours')}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                <span>Tours</span>
              </Button>
              
              <Button
                onClick={() => navigate('/admin/analytics/customers')}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </Button>
              
              <Button
                onClick={() => navigate('/admin/analytics/bookings')}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Bookings</span>
              </Button>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
