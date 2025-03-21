import React, { useContext, useEffect, useRef, useState, useTransition } from 'react';
import Notification from '../notification/Notification';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { io, Socket } from 'socket.io-client';

type PaymentMethod = 'Test Donation' | 'Cardiant Donation' | 'Office Donation';

interface FormData {
  donorId: string | undefined;
  campaignId: string;
  amount: string;
  donorName: string;
  donorEmail: string;
  companyName: string;
  postalCode: string;
  city: string;
  houseNumber: string;
}

const DonationForm: React.FC<{ id: string, campaigner: string }> = ({ id, campaigner }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Test Donation');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string>('150');
  const [isDonate, setIsDonate] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState("")
  const { user } = useContext(AuthContext) || { user: null };
  const [isPending, startTransition] = useTransition();
  const socketRef = useRef<Socket | null>(null);

  const [formData, setFormData] = useState<FormData>({
    donorId: user?.userId,
    campaignId: id,
    amount: '150',
    donorName: '',
    donorEmail: '',
    companyName: '',
    postalCode: '',
    city: '',
    houseNumber: '',
  });

  // Connect to Socket.IO server
  useEffect(() => {
    socketRef.current = io(`${SOCKET_URL}`); // Replace with your server URL

    socketRef.current.emit('join-room', campaigner);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const predefinedAmounts = [
    { value: '150', label: 'R150' },
    { value: '170', label: 'R170' },
    { value: '190', label: 'R190' },
    { value: '250', label: 'R250' },
  ];

  const validateForm = () => {
    if (!formData.donorName.trim()) {
      setErrors("Name is required")
      return false;

    }

    if (!formData.donorEmail.trim()) {
      setErrors("Email is required")
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
      setErrors("Invalid email format")
      return false;
    }

    if (!formData.companyName.trim()) {
      setErrors("Company name is required")
      return false;
    }

    if (!formData.postalCode.trim()) {
      setErrors("Postcode is required")
      return false;
    }

    if (!formData.city.trim()) {
      setErrors("City is required")
      return false;
    }

    if (!formData.houseNumber.trim()) {
      setErrors("House number is required")
      return false;
    }

    if (!agreeToTerms) {
      setErrors("Please agree to the Terms of Service")
      return false;
    }

    return true;


  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount('');
    setFormData(prev => ({ ...prev, amount: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors("");
  };

  const handleDonate = async () => {
    if (!validateForm()) {
      return;
    }
    console.log(formData)
    console.log(user)
    startTransition(async () => {
      try {
        const response = await axios.post(`${BASE_URL}/donations`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        

        const res =await axios.post(`${BASE_URL}/notifications/create`, {
          userId: campaigner,
          title: "New Donation",
          message: `A new donation of R${formData.amount} has been made to your campaign.`,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });


        const notification = res.data;

        socketRef.current?.emit('send-notification', {campaigner, notification});
        
          
        
        if (response.status === 201) {
          setIsDonate(true);
          // Reset form
          setFormData({
            donorId: user?.userId,
            campaignId: id,
            amount: '150',
            donorName: '',
            donorEmail: '',
            companyName: '',
            postalCode: '',
            city: '',
            houseNumber: '',
          });
          setSelectedAmount('150');
          setCustomAmount('');
          setAgreeToTerms(false);
        }
      } catch (error) {
        setErrors("Failed to process donation. Please try again.")
        console.error('Donation error:', error);
        alert('Failed to process donation. Please try again.');
      }
    });
  };

  return (
    <div className="w-full mx-auto p-1">
      {isDonate && (
        <Notification
          isOpen={isDonate}
          onClose={() => setIsDonate(false)}
          title="Donation successful"
          message="Thank you for your donation!"
          link="/home/campaigns"
        />
      )}
      {errors && <Notification isOpen={true} onClose={() => { setErrors("") }} title="Error" message={errors} type="error" />}

      {/* Payment Method Selection */}
      <div className="font-onest bg-white w-full rounded-lg border border-gray-300 p-4 shadow-sm mb-8 flex md:flex-row flex-col items-center justify-between">
        <div className='flex flex-col items-center gap-2'>
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          <div className="md:col-span-1">
            <input
              type="number"
              name="amount"
              placeholder="Enter Your Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        <div className='flex flex-col items-center gap-2'>
          <div className="flex md:flex-row gap-4 mb-6">
            {['Test Donation', 'Cardiant Donation', 'Office Donation'].map((method) => (
              <label key={method} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                  className="form-radio h-4 w-4 accent-[#BEE36E] border-gray-300"
                />
                <span className="ml-2 text-gray-700">{method}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => handleAmountSelect(amount.value)}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${selectedAmount === amount.value
                    ? 'bg-[#BEE36E] text-black'
                    : 'bg-white border border-[#BEE36E] text-black hover:bg-[#BEE36E]/10'
                  }`}
              >
                {amount.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Form */}
      <h2 className="text-xl font-semibold mb-4">Details</h2>

      <div className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              name="donorName"
              placeholder="Alex Jordan*"
              value={formData.donorName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-300} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent`}
            />

          </div>
          <div>
            <input
              type="email"
              name="donorEmail"
              placeholder="Name@Example.Com*"
              value={formData.donorEmail}
              onChange={handleChange}
              className={`w-full px-4 py-2 border 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent`}
            />

          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name*"
            value={formData.companyName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent`}
          />

        </div>
      </div>

      {/* Address Form */}
      <h2 className="text-xl font-semibold mb-4 mt-8">Address</h2>

      <div className='rounded-lg p-4 border border-gray-300 shadow-sm'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              name="postalCode"
              placeholder="Postcode*"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent`}
            />

          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="City*"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent`}
            />

          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            name="houseNumber"
            placeholder="House No*"
            value={formData.houseNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent`}
          />

        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-4">
        <input
          type="checkbox"
          id="terms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="w-4 h-4 accent-[#BEE36E] text-white cursor-pointer"
        />
        <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
          I agree to the Terms of Service
        </label>
      </div>

      <div className='flex items-center gap-4'>
        <button
          disabled={isPending}
          onClick={handleDonate}
          className="bg-[#BEE36E] text-black py-3 px-6 mt-4 rounded-full font-xs hover:bg-[#a8cc5c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Donating...' : 'DONATE NOW'}
        </button>

        <div className="text-black py-3 px-6 mt-4 rounded-full font-medium border border-gray-300">
          Total Amount: R{formData.amount}
        </div>
      </div>
    </div>
  );
};

export default DonationForm;