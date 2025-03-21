import axios from 'axios';
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config/url';


const DonationDetail = () => {
    const { id } = useParams();
    const [donation, setDonation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/analytics/donations/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.donation) {
                    setDonation(response.data.donation);
                } else {
                    setError('Donation data not found.');
                }
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch donation details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDonation();
    }, [id]);

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
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <img src={donation?.campaignId?.image} alt="Campaign" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className='flex md:flex-row flex-col items-center justify-between'>
                <p><strong>Donor Name:</strong> {donation?.donorId?.name || 'N/A'}</p>
                <p><strong>Campaign Title:</strong> {donation?.campaignId?.title || 'N/A'}</p>
                <p><strong>Target Amount:</strong> ${donation?.campaignId?.amount || 0}</p>

            </div>
            
            <p className='py-5'></p>
            <div className='flex md:flex-row flex-col items-center justify-between'>
            <p><strong>Payment Method:</strong> {donation?.paymentMethod || 'N/A'}</p>
            <p><strong>Status:</strong> {donation?.status || 'N/A'}</p>
            <p><strong>Donated Money:</strong> ${donation?.amount || 0}</p>
            </div>
            
            <p><strong>Date:</strong> {donation?.date ? new Date(donation.date).toLocaleString() : 'N/A'}</p>

            <button className='bg-green-500 mt-2 text-white px-4 py-2 rounded-md' onClick={()=>window.history.back()}>Back</button>
        </div>
    );
};

export default DonationDetail;
