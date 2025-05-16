import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import CampaignCard from '../../components/Campaigns/CampaignCard';
import { AuthContext } from '../../context/userContext';
import { BASE_URL } from '../../config/url';
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const MyCampaigns = () => {
  const { user } = useContext(AuthContext) || {};
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organization, setOrganization] = useState(null);

  // Fetch organization
  const fetchOrganization = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/organization/check`, {
        id: user?.userId,
        email: user?.email,
      });
      setOrganization(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.userId && user?.email) {
      fetchOrganization();
    }
  }, [user]);

  
  const fetchAllCampaigns = async () => {
    try {
      const [userRes, orgRes] = await Promise.all([
        axios.get(`${BASE_URL}/campaigns/getAllByUser/${user?.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        organization
          ? axios.get(`${BASE_URL}/campaigns/organisation/${organization}`)
          : Promise.resolve({ data: [] }),
      ]);

      const combined = [...userRes.data, ...orgRes.data];

      // Deduplicate by _id and sort by createdAt (newest first)
      const uniqueCampaigns = Array.from(
        new Map(combined.map((item) => [item._id, item])).values()
      ).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      console.log("campaigns", uniqueCampaigns);
      console.log("organizagtion", user);

      if(user.organization.role === 'editor'){
        return setCampaigns(uniqueCampaigns.filter(campaign => campaign.userId === user.userId));
      }

      setCampaigns(uniqueCampaigns);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch campaigns');
      toast.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId && organization !== null) {
      fetchAllCampaigns();
    }
  }, [user, organization]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">My Campaigns</h1>
          <p className="text-gray-500">
            {dayjs(new Date()).format('DD MMM YYYY')}
          </p>
        </div>
        <Link
          to="/user/dashboard/campaigns/create"
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full hover:opacity-80 transition-all duration-300"
        >
          Create Campaign
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </Link>
      </div>

      {campaigns.length === 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">No campaigns found</h1>
          <p className="text-gray-500">Create a campaign to get started</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign._id}
            campaign={campaign}
            campaigner={true}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCampaigns;
