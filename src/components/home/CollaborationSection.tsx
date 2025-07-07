import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const getFullUrl = (filePath: string) =>
  filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

const CollaborationSection: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization`);
      setData(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <section className="max-w-[1200px] mx-auto py-6 font-onest text-black">
      <div className="flex flex-col items-center justify-center gap-10">
        {/* Header */}
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='flex items-center justify-center gap-2'>
          <img src="/home-header.png" alt="aboutus" className="w-[20px] h-[14px]" />
          <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px] font-onest">ORGANIZATION</p>
        </div>
        <h1 className='text-4xl font-bold font-onest'>Featured Organization</h1>
        <p className='text-sm text-gray-500 font-sans'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
      </div>

        <div className="relative flex flex-wrap justify-between items-center gap-6 w-[90%] max-w-6xl">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-bg to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-bg to-transparent"></div>

          {/* Company Logos */}
          {loading ? (
            <p>Loading...</p>
          ) : data && data.length > 0 ? (
            data.map((item) => (
              <Link
                key={item._id}
                to={`/home/organization/${item._id}`}
                className="hover:scale-105 transition-all duration-300"
              >
                <img
                  src={getFullUrl(item.logo)}
                  alt={item.name || 'Organization'}
                  className="w-24 sm:w-32 md:w-40 lg:w-48 object-contain"
                />
              </Link>
            ))
          ) : (
            <img
              src="/collaborate-1.png"
              alt="Default Organization"
              className="w-24 sm:w-32 md:w-40 lg:w-48 object-contain"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
