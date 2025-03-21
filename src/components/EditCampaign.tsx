import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import upload from '../utils/upload';

interface CampaignData {
    title: string;
    description: string;
    story: string;
    goal: string;
    amount: number;
    city: string;
    country: string;
    address: string;
    zipCode: string;
    category: string;
    image: string;
    video?: string;
    media?: string;
    startDate: string;
    endDate: string;
    donorCommunication?: string;
}

const EditCampaign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState<CampaignData>({
        title: '',
        description: '',
        story: '',
        goal: '',
        amount: 0,
        city: '',
        country: '',
        address: '',
        zipCode: '',
        category: '',
        image: '',
        video: '',
        media: '',
        startDate: '',
        endDate: '',
        donorCommunication: ''
    });
    const [pic, setPic] = useState<File | null>(null);



    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/campaigns/getById/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const campaign = response.data;
                setFormData({
                    title: campaign.title || '',
                    description: campaign.description || '',
                    story: campaign.story || '',
                    goal: campaign.goal || '',
                    amount: campaign.amount || 0,
                    city: campaign.city || '',
                    country: campaign.country || '',
                    address: campaign.address || '',
                    zipCode: campaign.zipCode || '',
                    category: campaign.category || '',
                    image: campaign.image || '',
                    video: campaign.video || '',
                    media: campaign.media || '',
                    startDate: campaign.startDate ? dayjs(campaign.startDate).format('YYYY-MM-DD') : '',
                    endDate: campaign.endDate ? dayjs(campaign.endDate).format('YYYY-MM-DD') : '',
                    donorCommunication: campaign.donorCommunication || ''
                });
                setImagePreview(campaign.image || '');
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching campaign:', error);
                toast.error('Failed to load campaign details');
                navigate('/admin/campaigns');
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPic( file || null);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const imgUrl = await upload(pic);
            formData.image = imgUrl;
            await axios.put(`${BASE_URL}/campaigns/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Campaign updated successfully');
            window.history.back();
        } catch (error) {
            console.error('Error updating campaign:', error);
            toast.error('Failed to update campaign');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Image */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Campaign Image
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-32 border rounded-lg overflow-hidden">
                            <img 
                                src={imagePreview} 
                                alt="Campaign preview" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#BEE36E] file:text-black
                                hover:file:bg-[#BEE36E]/80"
                        />
                    </div>
                </div>

                {/* Campaign Title and Description */}
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Campaign Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                    
                </div>

                <div className='w-full flex  flex-col gap-4'>
                <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Short Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={2}
                            className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]'
                        />
                    </div>

                </div>



                {/* Campaign Story */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Campaign Story
                    </label>
                    <textarea
                        name="story"
                        value={formData.story}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                        required
                    />
                </div>

                {/* Campaign Goal */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Campaign Goal
                    </label>
                    <textarea
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                        required
                    />
                </div>

                {/* Amount and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Required Amount (R)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Environment">Environment</option>
                            <option value="Social">Social</option>
                            <option value="Technology">Technology</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                </div>

                {/* Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            ZIP Code
                        </label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                </div>

                {/* Campaign Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                            required
                        />
                    </div>
                </div>

                {/* Additional Media */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Video URL (Optional)
                    </label>
                    <input
                        type="url"
                        name="video"
                        value={formData.video}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                        placeholder="https://youtube.com/..."
                    />
                </div>

                {/* Media */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Video URL (Optional)
                    </label>
                    <input
                        type="url"
                        name="media"
                        value={formData.media}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                        placeholder="https://youtube.com/..."
                    />
                </div>

                {/* Donor Communication */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Donor Communication Plan
                    </label>
                    <textarea
                        name="donorCommunication"
                        value={formData.donorCommunication}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
                        placeholder="Describe how you'll communicate with donors..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#BEE36E] text-black rounded-md hover:bg-[#BEE36E]/80 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Campaign'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCampaign;