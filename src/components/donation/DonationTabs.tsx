import { ArrowDownIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import Donations from './DonationReceived';
import DonationSent from './DonationSent';

const tabs = [
    { name: 'Received', key: 'received' },
    { name: 'Sent', key: 'sent' }
];

const DonationsTabs = () => {
    const [activeTab, setActiveTab] = useState<string>('received');
    const { user } = useContext(AuthContext) || {};
    
    // State for received donations
    const [receivedDonations, setReceivedDonations] = useState([]);
    const [receivedLoading, setReceivedLoading] = useState(true);
    const [receivedError, setReceivedError] = useState(null);
    
    // State for sent donations
    const [sentDonations, setSentDonations] = useState([]);
    const [sentLoading, setSentLoading] = useState(true);
    const [sentError, setSentError] = useState(null);

    // Fetch received donations (for campaigners)
    useEffect(() => {
        if (user?.userId) {
            const fetchReceivedDonations = async () => {
                try {
                    if (user?.organization?.role == "owner") {
                        const res = await axios.get(`${BASE_URL}/analytics/campaigner/organization/latest-donations/${user?.organization?._id}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                        setReceivedDonations(res.data);
                        setReceivedLoading(false);
                        return;
                    }
                    const res = await axios.get(`${BASE_URL}/analytics/campaigner/latest-donations/${user?.userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setReceivedDonations(res.data);
                } catch (error: any) {
                    setReceivedError(error);
                } finally {
                    setReceivedLoading(false);
                }
            };
            fetchReceivedDonations();
        }
    }, [user]);

    // Fetch sent donations (for donors)
    useEffect(() => {
        if (user?.userId) {
            const fetchSentDonations = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/donations/donor/${user?.userId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setSentDonations(res.data);
                } catch (error: any) {
                    setSentError(error);
                } finally {
                    setSentLoading(false);
                }
            };
            fetchSentDonations();
        }
    }, [user]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center sm:flex-row flex-col gap-2 justify-between'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>Donations</h1>
                    <p className='text-xs text-gray-500'>{dayjs().format('DD MMM YYYY')}</p>
                </div>
                <button className='bg-secondary text-white px-4 py-2 rounded-full hover:bg-[#B42318]/80 flex items-center gap-2'>
                    Download Reports
                    <ArrowDownIcon className='w-4 h-4' />
                </button>
            </div>

            <div className='flex md:flex-row flex-col items-center justify-center gap-2'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex w-[100px] items-center justify-center gap-2 px-4 py-2 md:text-sm text-xs rounded-full transition-all duration-200 ${
                            activeTab === tab.key
                                ? 'bg-secondary text-white'
                                : 'outline outline-secondary outline-1 text-secondary'
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {activeTab === 'received' ? (
                <Donations 
                    loading={receivedLoading} 
                    error={receivedError} 
                    donations={receivedDonations} 
                />
            ) : (
                <DonationSent 
                    loading={sentLoading} 
                    error={sentError} 
                    donations={sentDonations} 
                />
            )}
        </div>
    );
};

export default DonationsTabs;