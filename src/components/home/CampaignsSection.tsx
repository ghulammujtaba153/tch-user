import React from 'react';
import CampaignCard from '../Campaigns/CampaignCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
    partialVisibilityGutter: 20,
  },
};

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
        const data = res.data.filter((campaign: any) => campaign.isFavourite == true);
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <section className="max-w-[1200px] mx-auto py-16 px-4 text-black flex flex-col items-center gap-4">
      {/* Header */}
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='flex items-center justify-center gap-2'>
          <img src="/home-header.png" alt="aboutus" className="w-[20px] h-[14px]" />
          <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px] font-onest">CAMPAIGNS</p>
        </div>
        <h1 className='text-4xl font-bold font-onest text-[#0033A0]'>Featured Campaigns</h1>
        <p className='text-sm text-gray-500 font-sans'>Your donations will help grow a lasting legacy.</p>
      </div>

      {/* Carousel with Campaign Cards */}
      <div className="w-full">
        <Carousel
          responsive={responsive}
          swipeable
          draggable
          showDots={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          itemClass="px-2"
        >
          {campaigns.map((campaign: any) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </Carousel>
      </div>

      {/* Button */}
      <Link
        to="/home/campaigns"
        className='w-[150px] h-[55px] flex items-center justify-center gap-2 border border-secondary text-secondary px-4 py-2 rounded-full hover:shadow-lg hover:bg-secondary hover:text-white transition-all duration-300 mt-4'>
        View All
        <ArrowRightIcon className='w-5 h-5' />
      </Link>
    </section>
  );
};

export default CampaignsSection;
