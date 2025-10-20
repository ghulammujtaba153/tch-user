import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ArrowRightIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import Loading from '../Loading';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import axios from 'axios';
import { AuthContext } from '../../context/userContext';
import { toast } from 'react-toastify';

const DonationSent = () => {
  const [sentDonations, setSentDonations] = useState([]);
  const [sentLoading, setSentLoading] = useState(true);
  const [sentError, setSentError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
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

  // Filter donations by date range using dayjs
  const filteredDonations = useMemo(() => {
    return sentDonations.filter((item: any) => {
      const donationDate = dayjs(item.date);
      const afterFrom = fromDate ? donationDate.isSame(dayjs(fromDate), 'day') || donationDate.isAfter(dayjs(fromDate), 'day') : true;
      const beforeTo = toDate ? donationDate.isSame(dayjs(toDate), 'day') || donationDate.isBefore(dayjs(toDate), 'day') : true;
      return afterFrom && beforeTo;
    });
  }, [sentDonations, fromDate, toDate]);

  // Pagination calculations (use filteredDonations)
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentPageData = useMemo(() => {
    return filteredDonations.slice(startIndex, endIndex);
  }, [filteredDonations, startIndex, endIndex]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

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

  const handlePrint = async (donation) => {
    const toastId = toast.loading("Generating S18A Certificate...");

    try {
      const res = await axios.post(`${BASE_URL}/s18/document`, donation);

      toast.update(toastId, {
        render: "Certificate generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Get the outputPath and convert to browser-accessible URL
      const outputPath = res.data.outputPath;
      if (!outputPath) {
        toast.error("No certificate path returned from server");
        return;
      }

      // extract basename robustly (works for windows/linux absolute paths and urls)
      const fileName = (outputPath || "")
        .split(/[\\/]/)
        .pop() || `certificate-${Date.now()}.pdf`;
      
      // ensure no duplicate slashes and encode filename
      const base = SOCKET_URL.replace(/\/+$/, "");
      const fileUrl = `${base}/certificates/${encodeURIComponent(fileName)}`;

      // Try to download the file as a blob so Chrome will prompt download instead of opening
      try {
        const token = localStorage.getItem('token') || undefined;
        const fileRes = await axios.get(fileUrl, {
          responseType: 'blob',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        // determine filename from response headers if provided
        const disposition = fileRes.headers['content-disposition'];
        let inferredName = fileName;
        if (disposition) {
          const match = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i.exec(disposition);
          if (match && match[1]) {
            inferredName = decodeURIComponent(match[1]);
          }
        }

        const blob = new Blob([fileRes.data], { type: fileRes.data.type || 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = inferredName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (downloadErr) {
        // Fallback: open in new tab if blob download fails (CORS or server issues)
        console.warn("Blob download failed, falling back to open in new tab:", downloadErr);
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to generate S18A Certificate",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error generating S18A Certificate: ", error);
    }
  };

  if (sentLoading) return <div className="flex justify-center items-center"><Loading /></div>;
  if (sentError) return <div>Error: {sentError.message}</div>;

  return (
    <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-lg p-4">
      {/* Date Filter */}
      <div className="flex flex-wrap gap-4 items-center mb-2">
        <div>
          <label className="text-sm text-gray-600 mr-2">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mr-2">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setFromDate(''); setToDate(''); }}
          className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center sm:flex-row flex-col gap-2 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">Sent Donations</h1>
          {sentDonations.length > 0 && (
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {sentDonations.length} total donations
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sentDonations.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Show:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
          <button
            onClick={handleDownloadCSV}
            className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2"
          >
            Download CSV
            <ArrowUpIcon className="w-4 h-4" />
          </button>
        </div>
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
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign/Organisation</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageData.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                          {item.transactionId || item.referenceId}
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
                          R{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.totalAmount)}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {item?.s18aRecord?.length > 0 &&
                          <button
                          onClick={() => handlePrint(item.s18aRecord[0])}
                          className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2"
                        >
                          <span>Download Certificate</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {currentPageData.map((item: any) => (
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

          {/* Pagination Controls */}
          {sentDonations.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, sentDonations.length)} of {sentDonations.length} donations
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (page === 2 && currentPage > 3) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      if (page === totalPages - 1 && currentPage < totalPages - 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationSent;
