import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Loading from '../Loading';
import ReactGA from 'react-ga4';
import ScrollToTop from '../../utils/ScrollToTop';
import { useAppConfig } from '../../context/AppConfigContext';
import { FaArrowLeft } from 'react-icons/fa';

const Guide = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Guide | ${config.name}`;
    }
  }, [config]);


  ReactGA.event({
    category: 'Guides',
    action: 'View Guide',
    label: data ? data.title : 'Unknown Guide',
  })

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide/${id}`);
      setData(res.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
  }

  if (!data) {
    return <div className="text-center py-10 text-red-600">No guide found.</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 mt-[100px]">
      <ScrollToTop />
      <div className='flex items-center px-2 gap-2 cursor-pointer mb-5' onClick={() => window.history.back()}>
        <FaArrowLeft className="w-6 h-6 cursor-pointer" />
        <p className='text-sm'>Back to Guides</p>
      </div>
      
      {/* Cover Image */}
      <img
        src={data.image}
        alt={data.title}
        className={`w-full h-full object-cover shadow-lg mb-12 rounded-lg transition-all duration-500 ${
            loaded ? "blur-0 opacity-100" : "blur-md opacity-60 animate-pulse"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
      />

      {/* Title & Description */}
      <h1 className="text-3xl font-bold mb-2 text-secondary">{data.title}</h1>
      <p className="text-gray-600 mb-4">{data.description}</p>

      {/* Rich Text Content */}
      <div
        className="prose max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      {/* Video */}
      <video
        controls
        src={data.videoUrl}
        className="w-full rounded-md shadow-md"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Guide;
