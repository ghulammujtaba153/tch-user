import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL, SOCKET_URL } from '../config/url';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import CampaignTabs from '../components/organizationProfile/CampaignTabs';
import ScrollToTop from '../utils/ScrollToTop';
import { useAppConfig } from '../context/AppConfigContext';
import DonationModal from '../components/organizationProfile/DonationModal';

const getFullUrl = (filePath: string) =>
  filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

const OrganizationPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [btnConfig, setBtnConfig] = useState({
    text: "Donate Now",
    color: "#3b82f6",
    textColor: "#fff",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { config } = useAppConfig();

  useEffect(() => {
    if (config?.name) {
      document.title = `Organization | ${config.name}`;
    }
  }, [config]);

  const fetchDonationBtn = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donate/btn/${id}`);
      if (res.data) {
        setBtnConfig(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching donation button');
    }
  };

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

  const { name, description, logo, city, country, supportingDoc, status } = organization;

  return (
    <div className="pt-[100px] max-w-[1200px] mx-auto p-4 font-sans">
      <ScrollToTop />

      {/* Organization Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={getFullUrl(logo)}
          alt="Organization Logo"
          className="max-w-[200px] max-h-[200px] object-cover rounded-lg shadow"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          <p><strong>Location:</strong> {city}, {country}</p>

          <div>
            <p><strong>Status:</strong> {status === "active" ? "Verified" : "Unverified"}</p>
            <p><strong>Section 18A:</strong> {supportingDoc ? "Verified" : "Not Registered"}</p>
          </div>

          <p className="mt-2 text-gray-600">{description}</p>

          <button
            className="mt-5 hover:scale-105 text-white bg-secondary py-2 px-4 rounded-lg transition duration-200"
            style={{ color: btnConfig.textColor, backgroundColor: btnConfig.color }}
            onClick={() => setIsModalOpen(true)}
          >
            {btnConfig.text}
          </button>
        </div>
      </div>

      {/* Donation Modal */}
      {isModalOpen && (
        <DonationModal
          organizationId={organization._id}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Campaign Tabs */}
      <div className="mt-10">
        <CampaignTabs organizationId={organization._id} />
      </div>
    </div>
  );
};

export default OrganizationPage;
