import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import DonationsTabs from '../../components/donation/DonationTabs';
import Loading from '../../components/Loading';




const Donations = () => {
    // const [activeTab, setActiveTab] = useState<string>('profile');
    const {user} =useContext(AuthContext) || {};
    const [donations, setDonations]=useState([]);
    const [loading, setLoading] =useState(false);
    const [error, setError]=useState(null);

    // useEffect(()=>{
    //     if(user?.userId){
    //         const fetchDonations = async ()=>{
    //             try {
    //                 const res = await axios.get(`${BASE_URL}/analytics/campaigner/latest-donations/${user?.userId}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //                     },
    //                 });
    //                 setDonations(res.data);
    //                 console.log(res.data);
    //             } catch (error:any) {
    //                 setError(error);
    //             } finally {
    //                 setLoading(false);
    //             }

    //         }
    //         fetchDonations()
    //     }
    // },[user])


    if(loading) return <div className='flex justify-center items-center'><Loading/></div>
    if(error) return <div>Error: {error.message}</div>


    return <div className='flex flex-col gap-4'>
        <DonationsTabs/>

    </div>;
};

export default Donations;
