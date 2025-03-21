import React, { useState, ChangeEvent, useTransition } from 'react';
import Notification from '../components/notification/Notification';
import upload from '../utils/upload';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { AuthContext } from '../context/userContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

interface CampaignFormData {
  image: File | null;
  title: string;
  description: string;
  moneyTarget: string;
  category: string;
  event: string;
  story: string;
  challenge: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  postalCode: string;
  campaignVideoLinks: string;
  socialMediaLinks: string;
  donorCommunication: string;
}

const CreateCampaignForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<CampaignFormData>({
    image:  null,
    title: '',
    description: '',
    moneyTarget: '',
    category: '',
    event: '',
    story: '',
    challenge: '',
    startDate: '',
    endDate: '',
    address: '',
    city: '',
    postalCode: '',
    campaignVideoLinks: '',
    socialMediaLinks: '',
    donorCommunication: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const {token, user} = useContext(AuthContext) || {token: null, user: null};
  const [isPending, startTransition] = useTransition();



  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
        setFormData((prev) => ({ ...prev, image: file }));
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
        
    }
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (!user) {
            toast.error('Please login to create a campaign');
            return;
        }
        const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to create a campaign');
        console.error('No token found. Please log in.');
        return;
      }

        startTransition(async () => {
          try {
            const imageUrl=await upload(formData.image);
            const res = await axios.post(`${BASE_URL}/campaigns/create`, {
                userId: user?.userId,
                image: imageUrl,
                title: formData.title,
                description: formData.description,
                amount: formData.moneyTarget,
                category: formData.category,
            country: formData.event,
            story: formData.story,
            goal: formData.challenge,
            startDate: formData.startDate,
            endDate: formData.endDate,
            address: formData.address,
            city: formData.city,
            zipCode: formData.postalCode,
            video: formData.campaignVideoLinks,
            media: formData.socialMediaLinks,
            donorCommunication: formData.donorCommunication
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(formData);
        setIsSuccess(true);
        } catch (error: any) {
            toast.error('Error creating campaign');
            setError(error.response.data.message);
            console.error('Error creating campaign:', error);
        }
        });
    } catch (error) {
        toast.error('Error creating campaign');
        console.error('Error creating campaign:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-[100px] ">

            {isSuccess && <Notification isOpen={isSuccess} onClose={() => setIsSuccess(false)} title="Campaign created successfully" message="Campaign created successfully" link={`/home/campaigns`}/>}
        {error && <Notification isOpen={true} onClose={() => setError("")} title="Error" message={error} />}

        <div className='flex flex-col items-center border-2 border-gray-300 rounded-[40px] p-4 font-onest shadow-md'>
        <h1 className="text-2xl font-semibold mb-6">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
<div className='flex flex-col w-full'>
    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full">
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
        />
        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col gap-2 justify-center items-center">
            {/* Show preview if available */}
            {formData.image ? (
                <img src={imagePreview || ''} alt="Preview" className='w-full max-h-[200px] object-contain rounded-lg' />
            ) : (
                <>
                    <img src="/cloud-computing.png" alt="Upload" className='w-6 h-6' />
                    <span className="text-gray-500">Upload Image</span>
                </>
            )}
        </label>
    </div>
</div>

        

        {/* Title and Money Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Money Target</label>
            <input
              type="text"
              name="moneyTarget"
              placeholder="R1 50000"
              value={formData.moneyTarget}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea
            name="description"
            placeholder="Add Short Description"
            value={formData.description}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>
        

        {/* Category and Event */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Category</label>
            <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 cursor-pointer rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            >
            <option value="">Select category</option>
            <option value="animals">Education</option>
            <option value="animals">Health</option>
            <option value="animals">Environment</option>
            <option value="animals">Sports</option>
            <option value="animals">Arts</option>
            <option value="animals">Other</option>
            {/* Add more categories as needed */}
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Events</label>
            <select
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 cursor-pointer rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            >
              <option value="">Select event</option>
              <option value="event1">Event 1</option>
              {/* Add more events as needed */}
            </select>
          </div>
        </div>

        {/* Campaign Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Story</label>
          <textarea
            name="story"
            placeholder="Add Story"
            value={formData.story}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>

        {/* Campaign Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Challenge & Goal</label>
          <textarea
            name="challenge"
            placeholder="Add Challenge & Goal"
            value={formData.challenge}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Add Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="Johannesburg"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              placeholder="57986"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Video Links</label>
            <input
              type="url"
              name="campaignVideoLinks"
              placeholder="Link"
              value={formData.campaignVideoLinks}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
            <input
              type="url"
              name="socialMediaLinks"
              placeholder="Link"
              value={formData.socialMediaLinks}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Donor Communication */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donor Communication</label>
          <textarea
            name="donorCommunication"
            placeholder="Add Note"
            value={formData.donorCommunication}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-[#BEE36E] text-black rounded-full hover:bg-[#a8cc5c] transition-colors duration-200"
          >
            {isPending ? 'Creating...' : 'Create Campaign'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 text-[#BEE36E] border border-[#BEE36E] rounded-full hover:text-gray-800 transition-colors duration-200"
          >
            Discard
          </button>
        </div>
      </form>

        </div>
      
    </div>
  );
};

export default CreateCampaignForm;