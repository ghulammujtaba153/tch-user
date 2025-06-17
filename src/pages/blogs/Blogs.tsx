import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import axios from 'axios';
import Loading from '../../components/Loading';
import BlogCard from '../../components/blog/BlogCard';
import ScrollToTop from '../../utils/ScrollToTop';

interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  content: string;
}

const Blogs: React.FC = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/blog`);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const filteredBlogs = data.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-[1200px] mx-auto mt-[100px] p-6">
      <ScrollToTop />

      <div className="w-full flex items-center justify-center gap-2 mb-10">
        <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
        <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px]">
          BLOGS
        </p>
      </div>
      

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Search by Title */}
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Search by Title:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="border px-4 py-2 rounded-md text-gray-700 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter (optional in this case) */}
        {/* <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Filter by Category:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
          </select>
        </div> */}
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            
              <BlogCard data={blog} />
            
          ))
        ) : (
          <div className="col-span-3 text-center text-lg text-gray-500">
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
