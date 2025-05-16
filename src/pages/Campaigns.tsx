import { useEffect, useState } from 'react';
import CampaignCard from '../components/Campaigns/CampaignCard';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { FiFilter } from 'react-icons/fi';

interface Campaign {
  _id: string;
  image: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  city: string;
  createdAt: string;
  totalDonations: number;
  lastDonationDate: string;
}

const Campaigns = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to 'All'
  const [searchQuery, setSearchQuery] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ["All", 'Education', 'Health', 'Sports', 'Arts', 'Environment', 'Other'];
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");

  


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/campaigns/getAllWithDonations`);
        setCampaigns(res.data);
        setFilteredCampaigns(res.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setError("Error fetching campaigns");
      } finally {
        setIsPending(false);
      }
    };

    fetch();
  }, []);

 
  useEffect(() => {
    let filtered = [...campaigns];

    
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(campaign =>
        campaign?.category === selectedCategory
      );
    }


    if (minAmount) {
      filtered = filtered.filter(campaign =>
        campaign.amount >= Number(minAmount)
      );
    }
    if (maxAmount) {
      filtered = filtered.filter(campaign =>
        campaign.amount <= Number(maxAmount)
      );
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedCategory, minAmount, maxAmount, sortBy, campaigns]);

  return (
    <div className='max-w-[1200px] mx-auto p-4 flex flex-col gap-5 min-h-screen items-center pt-[100px] overflow-x-hidden font-sans'>
      {/* Header Section */}
      <div className="w-full flex items-center justify-center gap-2">
        <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
        <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px]">
          CAMPAIGNS
        </p>
      </div>

      <h1 className='text-4xl font-bold font-onest'>All Campaigns</h1>
      <p className='text-gray-700 text-sm font-sans'>Explore our campaigns and support the causes you care about.</p>

      {/* Search & Filters Section */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-4 relative'>
        {/* Search Bar */}
        <div className='flex items-center gap-2 border border-gray-300 rounded-full p-2 w-[320px]'>
          <input
            type="text"
            placeholder='Search Campaigns'
            className='w-full h-[20px] rounded-full bg-transparent outline-none px-2'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src="/search.png" alt="search" className='w-[20px] h-[20px]' />
        </div>

        {/* Category Dropdown */}
        <div className='relative'>
          <div
            className='flex items-center gap-2 border border-gray-300 rounded-full p-2 px-4 cursor-pointer'
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <p className='text-sm font-normal text-gray-600 min-w-[100px]'>{selectedCategory}</p>
            <img src="/arrow-down.png" alt="sort" className='w-[15px] h-[15px]' />
          </div>

          {categoryOpen && (
            <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryOpen(false);
                    if (category === 'All') {
                      setSortBy('newest'); // Reset sorting when "All" is selected
                    }
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filters */}
        <div className='relative'>
          <div
            className='w-[100px] flex items-center gap-2 border border-gray-300 rounded-full p-2 px-4 cursor-pointer'
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <p className='text-sm font-normal text-gray-600'>Filters</p>
            <FiFilter className='text-gray-600' />
          </div>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-md z-10 p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPending ? (
        <div className='flex items-center justify-center h-screen'>
          <div className='w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-4 border-blue-500 rounded-full animate-spin'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;