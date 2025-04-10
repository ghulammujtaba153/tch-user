import React from 'react';

interface StatsCardProps {
    title: string;
    value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
    return (
        <div className='bg-white shadow-md flex flex-col gap-4 min-w-[160px] hover:border-[#B3B3B3] rounded-lg px-4 py-6 border border-gray-200'>
            <p className='text-gray-500 text-xs'>{title}</p>
            <p className='text-2xl font-bold'>{Number(value).toFixed(2)}</p>
        </div>

    )
}

export default StatsCard;