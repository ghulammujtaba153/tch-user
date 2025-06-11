import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

const LatestDonations: React.FC<{ latestDonations: any }> = ({ latestDonations }) => {
    return (
        <div className='flex flex-col gap-4 rounded-lg p-2 sm:p-6 bg-white shadow-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold'>Latest Donations</h1>
                <Link to='/user/dashboard/donations' className='text-xs text-gray-500 hover:text-gray-700'>View All</Link>
            </div>

            <div className='overflow-x-auto'>
                <div className='min-w-[600px]'> {/* Set minimum width for the table */}
                    <div className='flex flex-col gap-4 max-h-[400px] overflow-y-auto'>
                        {/* Header row */}
                        <div className='grid grid-cols-3 gap-4 px-2 py-1 text-xs font-semibold text-gray-500'>
                            <div>Donor</div>
                            <div>Campaign</div>
                            <div className='text-right'>Amount</div>
                        </div>

                        {latestDonations?.map((item: any) => (
                            <div key={item.id} className='grid grid-cols-3 gap-4 hover:bg-gray-100 cursor-pointer p-2 sm:p-3 rounded-lg'>
                                {/* Donor column */}
                                <div className='flex items-center gap-2'>
                                    <img 
                                        src={item.anonymous ? '/user.png' : item.user.profilePicture || '/user.png'} 
                                        alt="" 
                                        className='w-10 h-10 rounded-full' 
                                    />
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-sm font-bold truncate'>{item.anonymous ? 'Anonymous' : item.userName}</p>
                                        <p className='text-xs text-gray-500'>{dayjs(item.date).format('DD/MM/YYYY')}</p>
                                    </div>
                                </div>
                                
                                {/* Campaign column */}
                                <p className='text-sm truncate flex items-center'>
                                    {item.campaignName}
                                </p>
                                
                                {/* Amount column */}
                                <p className='text-sm text-right'>
                                    R{item.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestDonations;