import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import CampaignTabs from '../components/organizationProfile/CampaignTabs';
import ScrollToTop from '../utils/ScrollToTop';

const Organization = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState(null);
  const [btnConfig, seBtnConfig] = useState({
    text: "Donate Now",
    color: "#3b82f6",
    textColor: "#fff",
  });

  const fetchDonationBtn = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donate/btn/${id}`);
      seBtnConfig(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching donation button');
    }
  };

  useEffect(() => {
    
  }, []);

  const fetchOrganization = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization/orgId/${id}`);
      setOrganization(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch organization");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganization();
      fetchDonationBtn();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (!organization) return <p className="text-center text-red-500 mt-10">Organization not found.</p>;

  const { name, description, logo, email, phone, city, country, certificate, supportingDocument, userId } = organization;

  return (
    <div className="pt-[100px] max-w-[1200px] mx-auto p-4 font-sans">
      <ScrollToTop />
      {/* Organization Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Organization Logo */}
        <img
          src={logo}
          alt="Organization Logo"
          className="w-[120px] h-[120px] object-cover rounded-lg shadow"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          <p className="mt-2 text-gray-600">{description}</p>

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Location:</strong> {city}, {country}</p>
          </div>

          <button
            className="mt-5 hover:scale-105 text-white py-2 px-4 rounded-lg transition duration-200"
            style={{ backgroundColor: btnConfig.color, color: btnConfig.textColor }}
          >
            {btnConfig.text}
          </button>

        </div>
      </div>

      {/* User (Organization Admin) */}
      {userId && (
        <div className="mt-10 flex items-center gap-4">
          <img
            src={userId.profilePicture}
            alt="Admin Profile"
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">Managed by: {userId.name}</p>
            <p className="text-sm text-gray-600">{userId.email}</p>
          </div>
        </div>
      )}

      {/* Certificate & Supporting Documents
      <div className="mt-10 space-y-3">
        {certificate && (
          <div>
            <p className="font-medium text-gray-700">Certificate:</p>
            <img src={certificate} alt="Certificate" className="w-[300px] mt-2 rounded shadow" />
          </div>
        )}


      </div> */}

      {/* Campaign Tabs Section */}
      <div className="mt-10">
        
        <CampaignTabs organizationId={organization._id}/>
      </div>
    </div>
  );
};

export default Organization;
