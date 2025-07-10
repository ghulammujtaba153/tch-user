
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import LatestDonations from '../../components/dashboard/LatestDonations';
import FundsGraph from '../../components/dashboard/FundsGraph';
import { AuthContext } from '../../context/userContext';
import { BASE_URL } from '../../config/url';
import axios from 'axios';
import { useAppConfig } from '../../context/AppConfigContext';




const MainDashboard = () => {
    const { user } = useContext(AuthContext) || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const [latestDonations, setLatestDonations] = useState<any>(null);
    const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Dashboard | ${config.name}`;
    }
  }, [config]);

    console.log("user from context ",user);

    const card = [
        {
            title: "Total Funds Raised",
            value: basicInfo?.fundsRaised || 0
        },
        {
            title: "Active Campaigns",
            value: basicInfo?.totalActiveCampaigns || 0
        },
        {
            title: "Pending Withdrawals",
            value: basicInfo?.withdrawn || 0
        },
        {
            title: "Success Rate",
            value: basicInfo?.successRate || 0
        }
    ]

    const fetch = async () => {
        setLoading(true);
        try {
    
            if (user?.organization?.role== "owner") {
                const [basicInfoRes, donationsRes] = await Promise.all([
                axios.get(`${BASE_URL}/analytics/campaigner/basic-info/${user?.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
                axios.get(`${BASE_URL}/analytics/campaigner/organization/latest-donations/${user?.organization?._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
            ]);
    
            setBasicInfo(basicInfoRes.data);
            console.log(basicInfoRes.data);
    
            console.log(donationsRes.data);
            const donations = donationsRes.data;
            setLatestDonations(donations);

                return;
            }
            const [basicInfoRes, donationsRes] = await Promise.all([
                axios.get(`${BASE_URL}/analytics/campaigner/basic-info/${user?.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
                axios.get(`${BASE_URL}/analytics/campaigner/latest-donations/${user?.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
            ]);
    
            setBasicInfo(basicInfoRes.data);
            console.log(basicInfoRes.data);
    
            console.log(donationsRes.data);
            const donations = donationsRes.data;
            setLatestDonations(donations);
    
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!user?.userId) {
            return;
        }
    
        fetch();
    
    }, [user]);
    

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }
    
      if (error ) {
        return (
          <div className="text-center text-red-600 p-4">
            <p>{"Something went wrong! please signin again"}</p>
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
        <div className='px-4 py-2 flex flex-col gap-4'>


            {/* user info */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>Hello! {user?.name} <span className='text-gray-200 text-sm bg-secondary px-2 rounded-full'>{user.organization?.name? "Organization": "Donor"}</span> </h1>
                <p className='text-gray-500'>{dayjs(new Date()).format('DD MMM YYYY')}</p>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                {card.map((item, index) => (
                    <StatsCard key={index} title={item.title} value={item.value} />
                ))}
            </div>



            {/* Recent Donations & graph */}
            <div className='flex w-full md:flex-row flex-col justify-between  gap-4'>
                <div className='w-full md:w-1/2'>
                    <LatestDonations latestDonations={latestDonations} />
                </div>
                <div className='w-full md:w-1/2'>
                    <FundsGraph />
                </div>
            </div>


        </div>
    );
};

export default MainDashboard;
