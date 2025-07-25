import React, { useState, useEffect, useContext } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import Loading from '../Loading';
import { BASE_URL } from '../../config/url';
import axios from 'axios';
import { AuthContext } from '../../context/userContext';

const DonationSent = () => {
  const [sentDonations, setSentDonations] = useState([]);
  const [sentLoading, setSentLoading] = useState(true);
  const [sentError, setSentError] = useState(null);
  const { user } = useContext(AuthContext) || {};

  // Fetch sent donations (for donors)
  useEffect(() => {
    if (user?.userId) {
      const fetchSentDonations = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/donations/donor/${user?.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setSentDonations(res.data);
        } catch (error: any) {
          setSentError(error);
        } finally {
          setSentLoading(false);
        }
      };
      fetchSentDonations();
    }
  }, [user]);

  const handleDownloadCSV = () => {
    const csvHeader = ['Campaign Title', 'Date', 'Amount'];
    const csvRows = sentDonations.map((item) => [
      `"${item.campaignId?.title || 'Unknown Campaign'}"`,
      `"${dayjs(item.date).format('YYYY-MM-DD')}"`,
      `"${item.amount}"`,
    ]);

    const csvContent =
      [csvHeader, ...csvRows]
        .map((row) => row.join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sent_donations.csv';
    link.click();
  };

  if (sentLoading) return <div className="flex justify-center items-center"><Loading /></div>;
  if (sentError) return <div>Error: {sentError.message}</div>;

  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center sm:flex-row flex-col gap-2 justify-between">
        <h1 className="text-lg font-bold">Sent Donations</h1>
        <button
          onClick={handleDownloadCSV}
          className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2"
        >
          Download CSV
          <ArrowUpIcon className="w-4 h-4" />
        </button>
      </div>

      {sentDonations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ArrowUpIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No donations found</h2>
          <p className="text-gray-500 text-center">You haven't made any donations yet.</p>
        </div>
      ) : (
        <div className="w-full">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="w-full max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign/Organization</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sentDonations.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                          {item.referenceId}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item?.campaignId?.image || '/user.png'}
                            alt="campaign"
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.campaignId?.title || item.organizationId?.name || 'Unknown Campaign'}</p>
                            <p className="text-xs text-gray-500">{item.campaignId?.description?.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                          item.paymentMethod === 'eft' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.paymentMethod?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {dayjs(item.date).format('DD MMM YYYY')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-green-600">
                          R{new Intl.NumberFormat().format(item.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {sentDonations.map((item: any) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item?.campaignId?.image || '/user.png'}
                      alt="campaign"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{item.campaignId?.title || 'Unknown Campaign'}</h3>
                      <p className="text-xs text-gray-500">{dayjs(item.date).format('DD MMM YYYY')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    R{new Intl.NumberFormat().format(item.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                      #{item.referenceId}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                      item.paymentMethod === 'eft' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.paymentMethod?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    <span>Sent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationSent;
