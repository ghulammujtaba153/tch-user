import React, { useContext, useState, useEffect } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import Loading from '../../components/Loading';
import { useAppConfig } from '../../context/AppConfigContext';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const initialBankData = {
  userId: '',
  bankName: '',
  accountName: '',
  accountNumber: '',
  type: '',
  branch: '',
  branchCode: '',
  status: "pending"
};

const BankDetails = () => {
  const [bankData, setBankData] = useState<any>(initialBankData);
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
    const { user } = useContext<any>(AuthContext);
  const { config } = useAppConfig();

  useEffect(() => {
    if (config?.name) {
      document.title = `Bank Details | ${config.name}`;
    }
  }, [config]);

  const fetchBankDetails = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/bank-details/${user.userId}`);
      console.log("fetch bank details", res.data);
      
      const bankDataFromAPI = {
        userId: user?.userId,
        bankName: res.data.bankName || '',
        accountName: res.data.accountName || '',
        accountNumber: res.data.accountNumber || '',
        type: res.data.type || '',
        branch: res.data.branch || '',
        branchCode: res.data.branchCode || '',
        status: res.data.status || "pending"
      };

      setBankData(bankDataFromAPI);
      if(bankDataFromAPI.bankName){
        setIsUpdateMode(true);
      }
    } catch (error) {
      console.log('No bank details found for user');
      setBankData({ ...initialBankData, userId: user.userId });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchBankDetails();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankData({ ...bankData, [name]: value });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...bankData,
        userId: user.userId
      };

      const config = { headers: { 'Content-Type': 'application/json' } };
      const url = isUpdateMode ? `${BASE_URL}/bank-details/${user.userId}` : `${BASE_URL}/bank-details`;
      const method = isUpdateMode ? 'put' : 'post';

      const response = await axios[method](url, dataToSend, config);
      toast.success(`Bank details ${isUpdateMode ? 'updated' : 'saved'} successfully!`);
      
      if (isUpdateMode) {
        fetchBankDetails();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error saving bank details');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className='flex justify-center items-center'><Loading /></div>
  }

  return (
    <div className="py-10 px-4 md:px-8">
      <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* Status Badge */}
        {isUpdateMode && (
          <p className={`absolute top-4 left-4 text-gray-500 cursor-pointer flex items-center px-2 py-1 rounded-full ${
            bankData.status === 'approved' ? 'bg-green-300 text-green-800' : 
            bankData.status === 'rejected' ? 'bg-red-300 text-red-800' : 
            'bg-yellow-300 text-yellow-800'
          }`}>
            {bankData.status} {bankData.status === 'approved' && <FaCheckCircle className='inline-block ml-1' />} 
            {bankData.status === 'rejected' && <FaTimesCircle className='inline-block ml-1' />}
            {bankData.status === 'pending' && <FaClock className='inline-block ml-1' />}
          </p>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isUpdateMode ? 'Update Bank Details' : 'Bank Details Registration'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Banking Details Section */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Banking Details</h3>
            <p className="text-gray-500 mb-4 text-sm">Bank account information.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Bank Name" 
                name="bankName" 
                value={bankData.bankName} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Account Name" 
                name="accountName" 
                value={bankData.accountName} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Account Number" 
                name="accountNumber" 
                value={bankData.accountNumber} 
                onChange={handleChange} 
                required 
              />
              <select
                name="type"
                value={bankData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select Account Type</option>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
                <option value="business">Business</option>
                <option value="cheque">Cheque</option>
              </select>
              <Input 
                label="Branch" 
                name="branch" 
                value={bankData.branch} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Branch Code" 
                name="branchCode" 
                value={bankData.branchCode} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-secondary text-white px-6 py-2 rounded-md hover:scale-105 duration-300 transition-transform disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Bank Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);



export default BankDetails;