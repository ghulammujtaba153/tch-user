import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import GuideCard from './GuideCard'; // Note: Capitalized component name
import Loading from '../Loading';
import ScrollToTop from '../../utils/ScrollToTop';
import { useAppConfig } from '../../context/AppConfigContext';
import { FaArrowLeft } from 'react-icons/fa';

const GuidesMain = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const { config } = useAppConfig();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (config?.name) {
      document.title = `Guides | ${config.name}`;
    }
  }, [config]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide/category/${id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1); // Reset to first page when category changes
  }, [id]);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-center py-10"><Loading/></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[100px] min-h-screen">
      <ScrollToTop />
      <div className='flex items-center px-2 gap-2 cursor-pointer' onClick={() => window.history.back()}>
        <FaArrowLeft className="w-6 h-6 cursor-pointer" />
        <p className='text-sm'>Back to Categories</p>
      </div>

      <div className="w-full flex items-center justify-center gap-2 mb-10">
        <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
        <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px]">
          HELP GUIDE
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentData.length > 0 ? currentData.map((item) => (
          <GuideCard key={item._id} data={item} />
        ))
          : <div className="text-center py-10">No guides found</div>}
      </div>

      {/* Pagination Controls - Centered */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 mb-8">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm border rounded transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidesMain;
