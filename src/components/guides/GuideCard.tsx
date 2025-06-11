import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GuideCard = ({ data }: { data: any }) => {
  const [loaded , setLoaded] = useState(false);

  return (
    <Link
      to={`/guide/${data._id}`}
      className="block rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 bg-white"
    >
      <img
        src={data.image}
        alt={data.title}
        className={`w-full h-48 object-cover rounded-lg transition-all duration-500 ${
            loaded ? "blur-0 opacity-100" : "blur-md opacity-60 animate-pulse"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{data.description}</p>
      </div>
    </Link>
  );
};

export default GuideCard;
