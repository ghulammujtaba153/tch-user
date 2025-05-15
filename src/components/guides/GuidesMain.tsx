import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import GuideCard from './GuideCard'; // Note: Capitalized component name

const GuidesMain = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide/category/${id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[100px]">
      <h2 className="text-2xl font-semibold mb-6 text-center">Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.length > 0 ? data.map((item) => (
          <GuideCard key={item._id} data={item} />
        ))
          : <div className="text-center py-10">No guides found</div>}
      </div>
    </div>
  );
};

export default GuidesMain;
