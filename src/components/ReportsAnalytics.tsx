import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DocumentArrowDownIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import dayjs from 'dayjs';

// Mock data for the charts


const donorDistributionData = [
  { name: 'Recurring Donors', value: 65, color: '#0ea5e9' },
  { name: 'One-time Donors', value: 35, color: '#6366f1' },
];



// Mock data for scheduled reports
const scheduledReportsData = [
  {
    id: 1,
    name: 'Monthly Campaign Performance',
    frequency: 'Monthly',
    recipients: ['admin@example.com', 'manager@example.com'],
    nextRun: '2024-03-01',
  },
  {
    id: 2,
    name: 'Weekly Donor Activity',
    frequency: 'Weekly',
    recipients: ['admin@example.com'],
    nextRun: '2024-02-29',
  },
  {
    id: 3,
    name: 'Quarterly Financial Summary',
    frequency: 'Quarterly',
    recipients: ['finance@example.com', 'admin@example.com'],
    nextRun: '2024-04-01',
  },
];

const ReportsAnalytics: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('campaign');
  const [dateRange, setDateRange] = useState('last30');
  
  const location = useLocation();
  const pathname = location.pathname;
  const roles = ["campaign", "donor", "custom"];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>('');
  const [quickStats, setQuickStats] = useState<any>({});
  const [donationTrends, setDonationTrends] = useState<any>([]);
  const [topFiveDonationRaisers, setTopFiveDonationRaisers] = useState<any>([]);
  const [campaignMetrics, setCampaignMetrics] = useState<any>([]);
  const [donorGrowth, setDonorGrowth] = useState<any>([]);
  const [topContributers, setTopContributers] = useState<any>([]);
  useEffect(() => {
    const fetchApis = async () => {

      try {
        const res = await axios.get(`${BASE_URL}/analytics/reports/quick-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setQuickStats(res.data);
        console.log(res.data);

        const res2 = await axios.get(`${BASE_URL}/analytics/reports/donation-trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setDonationTrends(res2.data);
        console.log(res2.data);

        const res3 = await axios.get(`${BASE_URL}/analytics/reports/top-five-donation-raisers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setTopFiveDonationRaisers(res3.data);
        console.log(res3.data);

        const res4 = await axios.get(`${BASE_URL}/analytics/reports/campaign-metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCampaignMetrics(res4.data);
        console.log(res4.data);

        const res5 = await axios.get(`${BASE_URL}/analytics/reports/donor-growth` , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setDonorGrowth(res5.data);
        console.log(res5.data);

        const res6 = await axios.get(`${BASE_URL}/analytics/reports/top-contributers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setTopContributers(res6.data);
        console.log(res6.data);

      } catch (error: any) {
        console.log(error);
        setError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApis();
  }, []);


  useEffect(() => {
    const urlRole = pathname.split('/').pop();
    if (urlRole && roles.includes(urlRole)) {
      setSelectedTab(urlRole);
    }
  }, [pathname]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
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
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-3xl font-bold text-primary-600">R {quickStats.totalDonationAmount}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ {quickStats.monthlyGrowth}</span> vs. previous period
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Donors</h3>
          <p className="text-3xl font-bold text-green-600">{quickStats.totalDonaters}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ {quickStats.donatersGrowth}%</span> vs. previous period
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Campaign Success Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{quickStats.campaignSuccessRate.toFixed(2)}%</p>
          <p className="text-sm text-gray-600 mt-2">Based on goal achievement</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Donation</h3>
          <p className="text-3xl font-bold text-purple-600">R {quickStats.averageDonationAmount}</p>
          <p className="text-sm text-gray-600 mt-2">Per donor</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('campaign')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'campaign'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Campaign Performance
          </button>
          <button
            onClick={() => setSelectedTab('donor')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'donor'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Donor Insights
          </button>
          <button
            onClick={() => setSelectedTab('custom')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'custom'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Custom Reports
          </button>
        </nav>
      </div>

      {/* Campaign Performance Tab */}
      {selectedTab === 'campaign' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Fundraising Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalAmount" name="Amount (R)" stroke="#0ea5e9" />
                    <Line type="monotone" dataKey="totalDonors" name="Donors" stroke="#6366f1" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Campaigns</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topFiveDonationRaisers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="title" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="totalAmount" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Metrics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-left py-3 px-4">Funds Raised</th>
                    <th className="text-left py-3 px-4">Goal</th>
                    <th className="text-left py-3 px-4">Donors</th>
                    <th className="text-left py-3 px-4">Avg. Donation</th>
                    <th className="text-left py-3 px-4">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignMetrics.map((campaign: any, index: any) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{campaign.title}</td>
                      <td className="py-3 px-4">R{campaign.fundsRaised.toLocaleString()}</td>
                      <td className="py-3 px-4">R{(campaign.amount).toLocaleString()}</td>
                      <td className="py-3 px-4">{campaign.totalDonors}</td>
                      <td className="py-3 px-4">R{campaign.averageDonation == null ? 0 : campaign.averageDonation.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <progress value={campaign.successRate} max="100" className="min-w-20 rounded-full"></progress>
                          <span>{campaign.successRate.toFixed(2)}%</span>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Donor Insights Tab */}
      {selectedTab === 'donor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Donor Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donorDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {donorDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Donor Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donorGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalDonors" name="Total Donors" stroke="#0ea5e9" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Total Donated</th>
                    <th className="text-left py-3 px-4">Campaigns Supported</th>
                    <th className="text-left py-3 px-4">Last Donation</th>
                    <th className="text-left py-3 px-4">Donor Type</th>
                  </tr>
                </thead>
                <tbody>
                  {topContributers.map((contributor: any, index: any) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{contributor.donorName}</td>
                      <td className="py-3 px-4">${contributor.totalDonations.toLocaleString()}</td>
                      <td className="py-3 px-4">{contributor.numberOfDonations}</td>
                      <td className="py-3 px-4">{dayjs(contributor.lastDonation).format('DD-MM-YYYY')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {index < 3 ? 'Recurring' : 'One-time'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reports Tab */}
      {selectedTab === 'custom' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Report Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="campaign">Campaign Performance</option>
                    <option value="donor">Donor Activity</option>
                    <option value="financial">Financial Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="flex space-x-4">
                    <input
                      type="date"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="date"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metrics</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked />
                      <span>Funds Raised</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked />
                      <span>Donor Growth</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked />
                      <span>Campaign Success Rate</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="pdf">PDF Report</option>
                    <option value="csv">CSV Export</option>
                    <option value="excel">Excel Spreadsheet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">No Schedule</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                  <input
                    type="text"
                    placeholder="Enter email addresses"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Scheduled Reports</h3>
            <div className="space-y-4">
              {scheduledReportsData.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-sm text-gray-600">
                      {report.frequency} • {report.recipients.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      Next: {report.nextRun}
                    </div>
                    <button className="text-primary-600 hover:text-primary-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics; 