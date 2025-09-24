import { ClockIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const DonorCard = ({ donor }: { donor: any }) => {
    if (!donor || !donor.donorDetails || donor.donorDetails.length === 0) {
        return null; // If donor data is missing, return nothing
    }

    

    const donorDetail = donor.donorDetails[0];

    return (
        <div className='flex flex-col gap-2'>
            <div>
                <div className='flex flex-row lg:flex-row md:flex-col justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                        <img
                            src={donor.anonymous ? "/user.png" :   donorDetail.profilePicture || "/user.png"}
                            alt="avatar"
                            className='w-[50px] h-[50px] rounded-md'
                        />
                        <div className='flex flex-col justify-between h-full'>
                            <p className='text-sm font-bold text-black font-onest'>{donor.anonymous ? "Anonymous" : donorDetail.name || "Unknown Donor"}</p>
                            <div className='flex items-center gap-2'>
                                <ClockIcon className='w-5 h-5 text-gray-600' />
                                <p className='text-xs text-gray-600'>
                                    {donor?.date ? dayjs(donor.date).format('MMMM D YYYY') : "Date not available"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className='text-sm font-bold text-secondary'>
                        {/* {donor?.amount ? `R${donor.amount}` : "Amount not available"} */}
                        {donor?.totalAmount ? `R${donor.totalAmount}` : "Amount not available"}
                    </p>
                </div>
                <div className="w-full h-[1px] bg-gray-300 mt-2"></div>
            </div>
        </div>
    );
}

export default DonorCard;
