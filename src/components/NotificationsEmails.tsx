import React, { useEffect, useState } from 'react';
import {  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {  EnvelopeIcon, DocumentDuplicateIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

// Mock data for the charts
const emailEngagementData = [
  { name: 'Opened', value: 65, color: '#22c55e' },
  { name: 'Clicked', value: 20, color: '#0ea5e9' },
  { name: 'Ignored', value: 15, color: '#6b7280' },
];

const emailOpenRatesData = [
  { month: 'Jan', rate: 68 },
  { month: 'Feb', rate: 72 },
  { month: 'Mar', rate: 65 },
  { month: 'Apr', rate: 75 },
  { month: 'May', rate: 70 },
  { month: 'Jun', rate: 78 },
];

// Mock data for notifications
const notificationsData = [
  {
    id: 1,
    type: 'donation',
    title: 'New Large Donation',
    message: 'R5,000 donation received for Save the Forests campaign',
    timestamp: '2 hours ago',
    status: 'unread',
  },
  {
    id: 2,
    type: 'milestone',
    title: 'Campaign Milestone Reached',
    message: 'Clean Water Initiative has reached 80% of its goal',
    timestamp: '4 hours ago',
    status: 'read',
  },
  {
    id: 3,
    type: 'approval',
    title: 'Campaign Approved',
    message: 'Education for All campaign has been approved',
    timestamp: '1 day ago',
    status: 'read',
  },
];

// Mock data for email templates
const emailTemplatesData = [
  {
    id: 1,
    name: 'Campaign Update',
    subject: 'Updates on {campaign_name}',
    description: 'Keep donors informed about campaign progress',
    lastUsed: '2024-02-27',
  },
  {
    id: 2,
    name: 'Thank You Message',
    subject: 'Thank you for your donation, {donor_name}!',
    description: 'Express gratitude to donors',
    lastUsed: '2024-02-26',
  },
  {
    id: 3,
    name: 'Payment Confirmation',
    subject: 'Donation Confirmation - {campaign_name}',
    description: 'Confirm donation receipt',
    lastUsed: '2024-02-25',
  },
];

// Mock data for scheduled emails
const scheduledEmailsData = [
  {
    id: 1,
    subject: 'Monthly Campaign Update - March 2024',
    recipients: 'All Donors',
    scheduledFor: '2024-03-01 09:00',
    status: 'scheduled',
  },
  {
    id: 2,
    subject: 'Weekly Newsletter',
    recipients: 'Subscribers',
    scheduledFor: '2024-02-29 10:00',
    status: 'scheduled',
  },
];

const NotificationsEmails: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('center');
  // const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const location = useLocation();
  const pathname = location.pathname;
  const roles=  ["center", "emails", "templates"]

  useEffect(() => {
    const urlRole = pathname.split('/').pop();
    if (urlRole && roles.includes(urlRole)) {
      setSelectedTab(urlRole);
    }
  }, [pathname]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notifications & Emails</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          Compose Email
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Emails Sent</h3>
          <p className="text-3xl font-bold text-primary-600">12,847</p>
          <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Open Rate</h3>
          <p className="text-3xl font-bold text-green-600">72%</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ 5%</span> vs. last month
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Click-through Rate</h3>
          <p className="text-3xl font-bold text-blue-600">28%</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ 3%</span> vs. last month
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('center')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'center'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notification Center
          </button>
          <button
            onClick={() => setSelectedTab('emails')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'emails'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bulk Email Management
          </button>
          <button
            onClick={() => setSelectedTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'templates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Template Library
          </button>
        </nav>
      </div>

      {/* Notification Center Tab */}
      {selectedTab === 'center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
              <div className="space-y-4">
                {notificationsData.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg ${
                      notification.status === 'unread' ? 'bg-primary-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Donation Alerts</p>
                    <p className="text-sm text-gray-600">Notify when new donations are received</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Campaign Milestones</p>
                    <p className="text-sm text-gray-600">Notify when campaigns reach milestones</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Campaign Approvals</p>
                    <p className="text-sm text-gray-600">Notify when campaigns need approval</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Management Tab */}
      {selectedTab === 'emails' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Email Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emailOpenRatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" name="Open Rate (%)" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Email Engagement</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emailEngagementData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {emailEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Scheduled Emails</h3>
              <div className="flex space-x-4">
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="all">All Recipients</option>
                  <option value="donors">Donors Only</option>
                  <option value="creators">Campaign Creators</option>
                </select>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Schedule New
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {scheduledEmailsData.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{email.subject}</p>
                    <p className="text-sm text-gray-600">
                      To: {email.recipients} • Scheduled for: {email.scheduledFor}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button className="text-primary-600 hover:text-primary-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Template Library Tab */}
      {selectedTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Create Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailTemplatesData.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Last used: {template.lastUsed}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">Subject: {template.subject}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Template Variables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Donor Variables</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code>{`{donor_name}`}</code> - Full name of the donor</li>
                  <li><code>{`{donation_amount}`}</code> - Donation amount</li>
                  <li><code>{`{donation_date}`}</code> - Date of donation</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Campaign Variables</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code>{`{campaign_name}`}</code> - Name of the campaign</li>
                  <li><code>{`{campaign_goal}`}</code> - Campaign fundraising goal</li>
                  <li><code>{`{progress_percentage}`}</code> - Progress towards goal</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsEmails; 