import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  data: {
    _id: string;
    image: string;
    title: string;
    description: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-56">

        <img
          src={data.image}
          alt={data.title}
          className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
            loaded ? "blur-0 opacity-100" : "blur-md opacity-60 animate-pulse"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {data.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {data.description}
        </p>

        <div className="mt-auto">
          <Link
            to={`/blog/${data._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
