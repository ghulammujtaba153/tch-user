import React from 'react';
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
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img
        src={data.image}
        alt={data.title}
        className="w-full h-56 object-cover"
      />

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
