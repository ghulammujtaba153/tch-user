

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';


const getFullUrl = (filePath: string) =>
  filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

const CollaborationSection: React.FC = () => {


  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)


  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization`); 
      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetch()
  }, [])


  return (
    <section className="max-w-[1200px] mx-auto py-6 font-onest text-black">
      <div className="flex flex-col items-center justify-center gap-10">
        <p className="text-xs md:text-base lg:text-lg text-gray-500 text-center">
          We Collaborate with the top <span className='text-black font-bold'>200+</span> companies worldwide
        </p>

        <div className="relative flex flex-wrap justify-between items-center gap-6 w-[90%] max-w-6xl">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-bg to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-bg to-transparent"></div>

          {/* Company Logos */}
          {data && data.map((item: any) => <img src={getFullUrl(item.logo)} alt="/" className="w-24 sm:w-32 md:w-40 lg:w-48" />) || <img src="/collaborate-1.png" alt="logo" className="w-24 sm:w-32 md:w-40 lg:w-48" />}
          
          
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
