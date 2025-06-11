import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Loading from '../Loading';

const Guide = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

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
      <Link to="/guides" className='flex items-center gap-2 mb-4 w-10 h-10 hover:bg-gray-300 rounded-full p-2 cursor-pointer'>
        <ArrowLeftIcon className="w-6 h-6"/>
      </Link>
      {/* Cover Image */}
      <img
        src={data.image}
        alt={data.title}
        className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
            loaded ? "blur-0 opacity-100" : "blur-md opacity-60 animate-pulse"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
      />

      {/* Title & Description */}
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
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
