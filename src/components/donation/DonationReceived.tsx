import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import axios from 'axios';
import Loading from '../Loading';
import { AuthContext } from '../../context/userContext';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';

const DonationReceived = () => {
  const [receivedDonations, setReceivedDonations] = useState([]);
  const [receivedLoading, setReceivedLoading] = useState(true);
  const [receivedError, setReceivedError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { user } = useContext(AuthContext) || {};

    // Fetch received donations (for campaigners)
    useEffect(() => {
        if (user?.userId) {
            const fetchReceivedDonations = async () => {
                try {
          if (user?.organization?.role === "owner") {
                        const res = await axios.get(`${BASE_URL}/analytics/campaigner/organization/latest-donations/${user?.organization?._id}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                        setReceivedDonations(res.data);
                        setReceivedLoading(false);
                        return;
                    }
                    const res = await axios.get(`${BASE_URL}/analytics/campaigner/latest-donations/${user?.userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setReceivedDonations(res.data);
                } catch (error: any) {
                    setReceivedError(error);
                } finally {
                    setReceivedLoading(false);
                }
            };
            fetchReceivedDonations();
        }
    }, [user]);

    // Filter donations by date range using dayjs
    const filteredDonations = useMemo(() => {
      return receivedDonations.filter((item: any) => {
        const donationDate = dayjs(item.date);
        const afterFrom = fromDate ? donationDate.isSame(dayjs(fromDate), 'day') || donationDate.isAfter(dayjs(fromDate), 'day') : true;
        const beforeTo = toDate ? donationDate.isSame(dayjs(toDate), 'day') || donationDate.isBefore(dayjs(toDate), 'day') : true;
        return afterFrom && beforeTo;
      });
    }, [receivedDonations, fromDate, toDate]);

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


    const handlePrint = async (donation) => {
    const toastId = toast.loading("Generating S18A Certificate...");

    try {
      const res = await axios.post(`${BASE_URL}/s18/document`, donation);

      toast.update(toastId, {
        render: "Certificate generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Get the outputPath and convert to browser-accessible URL
      const outputPath = res.data.outputPath;
      if (outputPath) {
        const fileName =
          outputPath.split("certificates\\").pop() ||
          outputPath.split("certificates/").pop();
        const fileUrl = `${SOCKET_URL}/certificates/${fileName}`;
        window.open(fileUrl, "_blank");
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
    
  if (receivedLoading) return <div className="flex justify-center items-center"><Loading /></div>;
  if (receivedError) return <div>Error: {receivedError.message}</div>;

  const handleDownloadCSV = () => {
    const headers = ['Donor', 'Date', 'Campaign', 'Amount'];
    const rows = receivedDonations.map((item) => [
      `"${item.anonymous ? 'Anonymous' : item.userName}"`,
      `"${dayjs(item.date).format('YYYY-MM-DD')}"`,
      `"${item.campaignName}"`,
      item.amount,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'donations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      <div className='flex items-center sm:flex-row flex-col gap-2 justify-between'>
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">Received Donations</h1>
          {receivedDonations.length > 0 && (
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {receivedDonations.length} total donations
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {receivedDonations.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPageReceived" className="text-sm text-gray-600">Show:</label>
              <select
                id="itemsPerPageReceived"
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
            className='bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2'
          >
            Download Reports
            <ArrowDownIcon className='w-4 h-4' />
          </button>
        </div>
      </div>

      {receivedDonations.length === 0 ? (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">No donations found</h1>
        </div>
      ) : (
        <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-4">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-2 px-2 py-1 text-xs font-semibold text-gray-500 border-b border-gray-200">
            <div className="col-span-2">Donor</div>
            <div className="col-span-2">Campaign</div>
            <div>Avatar</div>
            <div>Amount</div>
            <div>Action</div>
          </div>

          {currentPageData.map((item: any) => (
            <div key={item.id} className="grid grid-cols-6 items-center gap-2 p-1 hover:bg-gray-50 rounded">
              {/* Donor Info */}
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex items-center justify-center bg-gray-100 rounded-full p-2">
                  <ArrowDownIcon className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold truncate">{item.anonymous ? 'Anonymous' : item.userName}</p>
                  <p className="text-xs text-gray-500">{dayjs(item.date).format('DD MMM YYYY')}</p>
                </div>
              </div>

              {/* Campaign Name */}
              <div className="col-span-2">
                <p className="text-sm truncate">{item.campaignName}</p>
              </div>

              {/* Avatar */}
              <div className="flex justify-center">
                <img
                  src={item.user?.profilePicture || '/user.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              {/* Amount */}
              <p className="text-sm font-semibold">
                R{new Intl.NumberFormat().format(item.amount)}
              </p>

              <p className="text-sm font-semibold">
                {item?.s18aRecord?.length > 0 &&
                  <button
                  onClick={() => handlePrint(item.s18aRecord[0])}
                  className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2"
                >
                  Download Certificate
                  <ArrowDownIcon className="w-4 h-4" />
                </button>}
              </p>
            </div>
          ))}

          {/* Pagination Controls */}
          {receivedDonations.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, receivedDonations.length)} of {receivedDonations.length} donations
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

export default DonationReceived;
