import React from 'react';
import CampaignCard from '../Campaigns/CampaignCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/url';

const CampaignsSection: React.FC = () => {
  const [campaigns, setCampaigns] = React.useState([]);

  React.useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/campaigns/getAllWithDonations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.data;
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    fetchCampaigns();
  }, [])


  return (
    <section className="max-w-[1200px] mx-auto py-16 px-4 text-black flex flex-col items-center gap-4">
      {/* Header */}
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='flex items-center justify-center gap-2'>
            <img src="/home-header.png" alt="aboutus" className="w-[20px] h-[14px]"/>
            <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px] font-onest">CAMPAIGNS</p>
          </div>
          <h1 className='text-4xl font-bold font-onest'>Featured Campaigns</h1>
          <p className='text-sm text-gray-500 font-sans'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. </p>

        </div>

        {/* Compaign Card */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {campaigns.slice(-3).map((campaign: any)=>(
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>

        {/* Button */}
        <Link to="/home/campaigns" className='w-[150px] h-[55px] flex items-center justify-center gap-2 border border-secondary text-secondary px-4 py-2 rounded-full'>View All

          <img src="/arrow.png" alt="arrow-right" className='w-[20px] h-[20px]' />
        </Link>
    </section>
  );
};

export default CampaignsSection;
