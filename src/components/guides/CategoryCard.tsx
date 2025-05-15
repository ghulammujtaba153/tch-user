import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ data }: { data: any }) => {
  return (
    <Link to={`/guides/${data._id}`} className='border shadow hover:shadow-md transition rounded-lg p-4 flex flex-col items-center bg-white'>
        
      <img
        src={data.icon}
        alt={data.name}
        className='w-24 h-24 object-contain mb-3 rounded-full border'
      />
      <p className='text-lg font-medium text-center'>{data.name}</p>
    </Link>
  );
};

export default CategoryCard;
