import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config/url';
import CategoryCard from './CategoryCard';

const GuideCategories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide-category?active=true`);
      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className='max-w-[1200px] mx-auto mt-[100px] px-4'>
      <div className="w-full flex items-center justify-center gap-2 mb-10">
        <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
        <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px]">
          GUIDE CATEGORIES
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 '>
          {data.length > 0 ? data.map((item: any) => (
            <CategoryCard key={item._id} data={item} />
          ))

          : <div className="text-center py-10">No guides category found</div>
        }
        </div>
      )}
    </div>
  );
};

export default GuideCategories;
