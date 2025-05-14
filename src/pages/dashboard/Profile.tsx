import React, { useContext, useEffect, useState } from 'react';
import { UserCircleIcon, LockClosedIcon, BanknotesIcon, PencilIcon } from '@heroicons/react/24/outline';
import Withdrawal from './Withdrawal';
import Security from './Security';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import dayjs from 'dayjs';
import Organization from './Organization';

const tabs = [
    { name: 'Personal & Organization', key: 'profile', icon: UserCircleIcon },
    { name: 'Organization', key: 'organization', icon: PencilIcon },
    { name: 'Security Settings', key: 'security', icon: LockClosedIcon },
    { name: 'Withdrawal', key: 'withdraw', icon: BanknotesIcon },
];

const Profile = () => {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const { user } = useContext(AuthContext) || {};
    const [data, setData] = useState<any>({
        profilePicture: "",
        name: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        organization: {
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            country: "",
        },
    });

    useEffect(() => {
        if (!user?.userId) return;
        const fetch = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/auth/profile?id=${user?.userId}`);
                console.log(res.data.user);
                setData(res.data.user);
            } catch (error) {
                console.log(error);
            }
        };
        fetch();
    }, [user?.userId]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex md:flex-row flex-col items-center justify-center gap-2'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-[250px] flex items-center justify-center gap-2 px-4 py-2 md:text-sm text-xs rounded-full transition-all duration-200 ${activeTab === tab.key
                            ? 'bg-secondary text-white'
                            : 'outline outline-secondary outline-1 text-secondary'
                            }`}
                    >
                        {tab.name} <tab.icon className='w-4 h-4' />
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className='p-4 mt-4'>
                {activeTab === 'security' && <Security />}
                {activeTab === 'withdraw' && <Withdrawal />}
                {activeTab === 'organization' && <Organization />}

                {activeTab === 'profile' && (
                    <div className='p-4 flex flex-col gap-4'>
                        <div className='flex sm:flex-row flex-col items-center justify-between'>
                            <h1 className='text-2xl font-bold text-secondary'>Personal Details</h1>
                            <Link to="/user/dashboard/profile/edit" className='bg-secondary flex items-center gap-2 text-white text-sm px-4 py-2 rounded-full'>Edit Profile <PencilIcon className='w-4 h-4' /></Link>
                        </div>

                        {/* Personal Details */}
                        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                            {/* Profile Details */}
                            <div className='flex flex-col md:flex-row md:items-center gap-4'>
                                <div className='max-w-[400px] h-full md:max-h-[250px]'>
                                    <img src={data?.profilePicture || 'https://i.ibb.co/5k0z6Zv/Profile-Picture.png'} alt="Profile" className='w-full h-full rounded-lg object-cover' />
                                    <p className='text-sm text-secondary cursor-pointer mt-2'>Upload Profile Picture</p>
                                </div>

                                <div className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Name</h1>
                                        <p className='text-sm text-gray-500'>{data?.name}</p>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Gender</h1>
                                        <p className='text-sm text-gray-500'>{data?.gender || 'N/A'}</p>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Date of Birth</h1>
                                        <p className='text-sm text-gray-500'>{dayjs(data?.dateOfBirth).format('DD/MM/YYYY') || 'N/A'}</p>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Nationality</h1>
                                        <p className='text-sm text-gray-500'>{data?.nationality || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Organization Details */}
                            <div className='flex flex-col gap-4'>
                                <h1 className='text-sm font-bold text-secondary'>Organization Details</h1>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-sm font-bold'>Name</h1>
                                    <p className='text-sm text-gray-500'>{data?.organization?.name || 'N/A'}</p>
                                </div>

                                <h1 className='text-sm font-bold text-secondary'>Contact Details</h1>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-sm font-bold'>Phone</h1>
                                    <p className='text-sm text-gray-500'>{data?.organization?.phone || 'N/A'}</p>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-sm font-bold'>Email</h1>
                                    <p className='text-sm text-gray-500'>{data?.organization?.email || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className='flex flex-col gap-4'>
                                <h1 className='text-sm font-bold text-secondary'>Address</h1>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-sm font-bold'>Address</h1>
                                    <p className='text-sm text-gray-500'>{data?.organization?.address || 'N/A'}</p>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-sm font-bold'>City</h1>
                                    <p className='text-sm text-gray-500'>{data?.organization?.city || 'N/A'}</p>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-sm font-bold'>Country</h1>
                                    <p className='text-sm text-gray-500'>{data?.organization?.country || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;