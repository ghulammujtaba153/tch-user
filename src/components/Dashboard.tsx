import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BASE_URL } from '../config/url';
import axios from 'axios';

interface QuickStats {
  totalCampaigns: number;
  campaignGrowth: number;
  campaignStats: {
    completionRate: number;
    statusDistribution: Record<string, { count: number; percentage: number }>;
    successRate: number;
  };
  totalUsers: number;
  userGrowth: number;
  totalDonations: number;
  donationGrowth: number;
}

interface DonationTrend {
  month: string;
  amount: number;
  count: number;
}

interface CampaignTrend {
  month: string;
  total: number;
  amount: number;
  byStatus: {
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
    inactive: number;
  };
}

interface Activity {
  type: string;
  title: string;
  details?: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [quickStats, setQuickStats] = useState<any | null>(null);
  const [donationTrends, setDonationTrends] = useState<any>([]);
  const [campaignTrends, setCampaignTrends] = useState<any>([]);
  const [recentActivity, setRecentActivity] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsRes = await axios.get(`${BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setQuickStats(statsRes.data);

        // Fetch donation trends
        const donationTrendsRes = await axios.get(`${BASE_URL}/dashboard/donation-trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setDonationTrends(donationTrendsRes.data.trends);

        // Fetch campaign trends
        const campaignTrendsRes = await axios.get(`${BASE_URL}/dashboard/campaign-trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCampaignTrends(campaignTrendsRes.data.trends);

        // Fetch recent activity
        const activityRes = await axios.get(`${BASE_URL}/dashboard/recent-activity`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setRecentActivity(activityRes.data.activities);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}(token expired), please SignIn again</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Campaigns</h3>
          <p className="text-3xl font-bold text-primary-600">{quickStats?.totalCampaigns}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className={`${quickStats?.campaignGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {quickStats?.campaignGrowth >= 0 ? '↑' : '↓'} {Math.abs(quickStats?.campaignGrowth || 0)}%
            </span> from last month
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Donors</h3>
          <p className="text-3xl font-bold text-green-600">{quickStats?.totalUsers}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className={`${quickStats?.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {quickStats?.userGrowth >= 0 ? '↑' : '↓'} {Math.abs(quickStats?.userGrowth || 0)}%
            </span> from last month
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-3xl font-bold text-blue-600">
            R{quickStats?.totalDonations.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className={`${quickStats?.donationGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {quickStats?.donationGrowth >= 0 ? '↑' : '↓'} {Math.abs(quickStats?.donationGrowth || 0)}%
            </span> from last month
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600">
            {quickStats?.campaignStats.completionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">Based on campaign goals</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Donation Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 'auto']} />
                <Tooltip 
                  formatter={(value) => `R${Number(value).toLocaleString()}`}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#0ea5e9" 
                  name="Donations (R)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#0ea5e9" name="Total Campaigns" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity :any, index :any) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{activity.type}</p>
                    <p className="text-sm text-gray-600">
                      {activity.title}
                      {activity.details && ` - ${activity.details}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;