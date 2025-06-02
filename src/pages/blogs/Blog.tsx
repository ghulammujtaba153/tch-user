import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Loading from '../../components/Loading';

const Blog = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<any>(null);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/blog/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  if (loading) return 
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>

  if (!blog) return <div className="text-center mt-24 text-red-500">Blog not found.</div>;

  return (
    <div className="max-w-[1200px] mx-auto pt-[100px] p-6 ">


      <Link to={'/blogs'} className='p-2 hover:bg-gray-200 cursor-pointer w-[50px] h-[50px] rounded-full flex items-center justify-center'>
        <ArrowLeftIcon className="w-6 h-6"/>
      </Link>
      

      <img
        src={blog.image}
        alt={blog.title}
        className="w-full max-h-[400px] object-cover rounded-lg mb-6"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-800">{blog.title}</h1>


      <p className="text-sm text-gray-700 mb-6">{blog.description}</p>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default Blog;
