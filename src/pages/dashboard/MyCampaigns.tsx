import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import CampaignCard from '../../components/Campaigns/CampaignCard';
import { AuthContext } from '../../context/userContext';
import { BASE_URL } from '../../config/url';
import axios from 'axios';


const campaign=[
  {
    _id:"1",
    image:"/campaign-card.png",
    title:"Campaign 1",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    amount:1000,
    totalDonations:500,
    lastDonationDate:"2021-01-01",
    city:"New York",
    createdAt:"2021-01-01"  

  },
  {
    _id:"2",
    image:"/campaign-card.png",
    title:"Campaign 2",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    amount:1000,
    totalDonations:500,
    lastDonationDate:"2021-01-01",
    city:"New York",
    createdAt:"2021-01-01"  
  },
  {
    _id:"2",
    image:"/campaign-card.png",
    title:"Campaign 2",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    amount:1000,
    totalDonations:500,
    lastDonationDate:"2021-01-01",
    city:"New York",
    createdAt:"2021-01-01"  
  },
  
]

const MyCampaigns = () => {
    const {user} =useContext(AuthContext) || {};
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);

    useEffect(()=>{
      if(!user?.userId){
        return;
      }
      const fetch =async()=>{
        try {
          const res=await axios.get(`${BASE_URL}/campaigns/getAllByUser/${user?.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          setCampaigns(res.data);
          console.log(res.data);
            
        } catch (error: any) {
          setError(error);
            console.log(error);
        } finally {
          setLoading(false);
        }
      }

      fetch();
        
    },[user])


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
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row justify-between items-center'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>My Campaigns</h1>
                    <p className='text-gray-500'>{dayjs(new Date()).format('DD MMM YYYY')}</p>
                </div>
                <Link to="/user/dashboard/campaigns/create" className='bg-secondary text-black px-4 py-2 rounded-full hover:opacity-80 transition-all duration-300'>Create Campaign</Link>
            </div>

            {
              campaigns.length===0 && (
                <div className='flex flex-col gap-2'>
                  <h1 className='text-2xl font-bold'>No campaigns found</h1>
                  <p className='text-gray-500'>Create a campaign to get started</p>
                </div>
              )
            }

            {/* campaign list */}
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {campaigns.map((campaign: any)=>(
                    <CampaignCard key={campaign._id} campaign={campaign} campaigner={true}/>
                ))}


            </div>

        </div>
    );
};

export default MyCampaigns;
