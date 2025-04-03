import { ArrowDownIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';

interface DonationsProps {
    loading: boolean;
    error: any;
    donations: any[];
}

const Donations = ({ loading, error, donations }: DonationsProps) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='flex flex-col gap-4 border border-gray-200 rounded-lg p-4'>
            <h1 className='text-lg font-bold'>Received Donations</h1>
            
            {donations.length === 0 ? (
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>No donations found</h1>
                </div>
            ) : (
                <div className='w-full max-h-[400px] overflow-y-auto flex flex-col gap-4'>
                    {donations.map((item: any) => (
                        <div key={item.id} className='flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-2 bg-gray-100 rounded-full p-3'>
                                    <ArrowDownIcon className='w-4 h-4 text-green-500' />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <p className='text-sm font-bold'>{item.userName}</p>
                                    <p className='text-xs text-gray-500'>{dayjs(item.date).format('DD MMM YYYY')}</p>
                                </div>
                            </div>
                            <p className='text-sm'>{item.campaignName}</p>
                            <img 
                                src={item.user.profilePicture || '/user.png'} 
                                alt="avatar" 
                                className='w-10 h-10 rounded-full' 
                            />
                            <p className='text-sm'>R{item.amount}</p>
                            <p className='text-xs text-gray-500'>{item.status}</p>
                            <div className='flex items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer'>
                                <EllipsisVerticalIcon className='w-4 h-4' />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Donations;