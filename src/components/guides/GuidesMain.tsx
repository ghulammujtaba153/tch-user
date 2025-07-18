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
  }, [id]);

  if (loading) {
    return <div className="text-center py-10"><Loading/></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[100px] h-screen">
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
        {data.length > 0 ? data.map((item) => (
          <GuideCard key={item._id} data={item} />
        ))
          : <div className="text-center py-10">No guides found</div>}
      </div>
    </div>
  );
};

export default GuidesMain;
