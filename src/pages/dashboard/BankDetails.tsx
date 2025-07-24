import React, { useContext, useState, useEffect } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import Loading from '../../components/Loading';
import { useAppConfig } from '../../context/AppConfigContext';
import { FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

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
  const [issues, setIssues] = useState<any>([]);

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

  const fetchIssues = async()=>{
    try {
      const res = await axios.get(`${BASE_URL}/issue-report/${user.userId}?type=bankDetails`)
      if(res.data.type == "bankDetails"){
        setIssues(res.data)
      }
    } catch (error) {
      toast.error("error while fetching issue")
    }
  }

  useEffect(() => {
    if (user?.userId) {
      fetchBankDetails();
      fetchIssues()
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
      toast.success(`Bank Details Submitted For Review!`);
      
      if (isUpdateMode) {
        fetchBankDetails();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error Submitting Bank Details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className='inline-block ml-1 text-sm' />;
      case 'rejected':
        return <FaTimesCircle className='inline-block ml-1 text-sm' />;
      case 'pending':
        return <FaClock className='inline-block ml-1 text-sm' />;
      default:
        return null;
    }
  };

  if (pageLoading) {
    return <div className='flex justify-center items-center min-h-screen'><Loading /></div>
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
              {isUpdateMode ? 'Update Bank Details' : 'Bank Details Registration'}
            </h1>
            
            {/* Status Badge */}
            {isUpdateMode && bankData.status && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bankData.status)}`}>
                {bankData.status.charAt(0).toUpperCase() + bankData.status.slice(1)}
                {getStatusIcon(bankData.status)}
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm sm:text-base">
            {isUpdateMode 
              ? "Update your banking information to ensure donations are processed correctly." 
              : "Add your banking details to receive donations directly to your account."
            }
          </p>
        </div>

        {/* Issues Alert - Show if rejected */}
        {bankData.status === "rejected" && issues?.issue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Issues Found with Your Bank Details
                </h3>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Please address the following issues:</p>
                  <div className="bg-white border border-red-200 rounded-md p-3">
                    <p className="font-medium">Issue:</p>
                    <p className="mt-1">{issues.issue}</p>
                  </div>
                  <p className="mt-2 text-xs">
                    Please correct the information and resubmit for review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Banking Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Banking Details</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4">Bank account information for receiving donations.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="type"
                    value={bankData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="business">Business</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
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
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full sm:w-auto bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Bank Details'
                )}
              </button>
            </div>
          </form>
        </div>
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
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

export default BankDetails;