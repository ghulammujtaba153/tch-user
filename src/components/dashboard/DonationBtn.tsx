import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const DonationBtn = ({ organizationId: propOrgId }) => {
  const { id: routeId } = useParams();
  const organizationId = propOrgId || routeId;

  const [data, setData] = useState({
    text: '',
    textColor: '#000000',
    color: '#000000',
    organizationId: organizationId || ''
  });

  const [edit, setEdit] = useState(false);

  const fetchDonationBtn = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donate/btn/${organizationId}`);
      console.log("fetching donation",res.data);
      if (res.data?._id) {
        setData(res.data);
        setEdit(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching donation button');
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchDonationBtn();
    }
  }, [organizationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (edit && data._id) {
        const res = await axios.put(`${BASE_URL}/donate/btn/${data._id}`, data);
        setData(res.data);
        toast.success('Donation button updated successfully');
      } else {
        const res = await axios.post(`${BASE_URL}/donate/btn`, {
          ...data,
          organizationId
        });
        setData(res.data);
        toast.success('Donation button created successfully');
        setEdit(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while submitting');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">
        {edit ? 'Edit Donation Button' : 'Create Donation Button'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input
            type="text"
            name="text"
            value={data.text}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input
            type="color"
            name="textColor"
            value={data.textColor}
            onChange={handleChange}
            className="w-16 h-10 border rounded cursor-pointer"
          />
          <span className="ml-2 text-sm">{data.textColor}</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            name="color"
            value={data.color}
            onChange={handleChange}
            className="w-16 h-10 border rounded cursor-pointer"
          />
          <span className="ml-2 text-sm">{data.color}</span>
        </div>

        <button
          type="submit"
          className="bg-secondary text-white px-4 py-2 rounded hover:scale-105 transition-transform duration-300"
        >
          {edit ? 'Update Button' : 'Create Button'}
        </button>
      </form>
    </div>
  );
};

export default DonationBtn;
