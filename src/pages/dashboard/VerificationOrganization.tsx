import React, { useEffect, useState, useContext } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import Loading from '../../components/Loading';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { Select, MenuItem } from '@mui/material';

interface VerificationData {
  userId: string;
  founderId: string;
  founderDocument: string;
  accountHolderName: string;
  identificationType: string;
  identification: string;
  reference: string;
  accountNo: string;
  accountType: string;
  bankName: string;
  bankDocument: string;
  crowdfund: boolean;
  eventCrowdfund: boolean;
  status?: string;
  name?: string;
  accountNumber?: string;
  supportingDocument?: string | File;
  socialMediaLinks?: string[];
}

const initialFormData: VerificationData = {
  userId: '',
  founderId: '',
  founderDocument: '',
  accountHolderName: '',
  identificationType: '',
  identification: '',
  reference: '',
  accountNo: '',
  accountType: '',
  bankName: '',
  bankDocument: '',
  crowdfund: false,
  eventCrowdfund: false,
};

const identificationType = [
  { value: 'SAID', label: 'SA ID Number' },
  { value: 'passportNumber', label: 'Passport Number' },
  { value: 'organizationNumber', label: 'Organization Registration Number' },
  { value: 'trustNumber', label: 'Trust Number' },
];

const accountType = [
  { value: 'Saving', label: 'Saving' },
  { value: 'current', label: 'Current' },
  { value: 'business', label: 'Business' },
];

const VerificationOrganization = () => {
  const [formData, setFormData] = useState<VerificationData>(initialFormData);
  const [founderIdPreview, setFounderIdPreview] = useState<string | null>(null);
  const [founderDocPreview, setFounderDocPreview] = useState<string | null>(null);
  const [bankDocPreview, setBankDocPreview] = useState<string | null>(null);
  const [founderIdFile, setFounderIdFile] = useState<File | null>(null);
  const [founderDocFile, setFounderDocFile] = useState<File | null>(null);
  const [bankDocFile, setBankDocFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { user } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [organization, setOrganization] = useState<VerificationData | null>(null);



  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/verify/${user.userId}`);
      console.log("fetch organization", res.data);
      setOrganization(res.data);
      
      
      const mergedData: VerificationData = {
        ...initialFormData,
        ...res.data,
        socialMediaLinks: res.data.socialMediaLinks ?? [''],
        userId: user?.userId,
        crowdfund: res.data.crowdfund || false,
        eventCrowdfund: res.data.eventCrowdfund || false,
      };
      
      setFormData(mergedData);
      setIsUpdateMode(true);

      if (res.data.founderId) setFounderIdPreview(`${SOCKET_URL}/${res.data.founderId}`);
      if (res.data.founderDocument) setFounderDocPreview(`${SOCKET_URL}/${res.data.founderDocument}`);
      if (res.data.bankDocument) {
        setBankDocPreview(`${SOCKET_URL}/${res.data.bankDocument}`);
      }
    } catch (error) {
      console.log('No organization data found for user');
      setFormData({ ...initialFormData, userId: user.userId });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetch();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>,
    index?: number
  ) => {
    const { name, value } = e.target as { name: string; value: any };

     if (name === 'crowdfund' || name === 'eventCrowdfund') {
      setFormData({ ...formData, [name]: !formData[name] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'founderId' | 'founderDocument' | 'bankDocument'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    switch (type) {
      case 'founderId':
        setFounderIdFile(file);
        setFounderIdPreview(previewURL);
        break;
      case 'founderDocument':
        setFounderDocFile(file);
        setFounderDocPreview(previewURL);
        break;
      case 'bankDocument':
        setBankDocFile(file);
        setBankDocPreview(previewURL);
        break;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formDataToSend = new FormData();

    // Append all form data fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert boolean values to string
        const formattedValue = typeof value === 'boolean' ? value.toString() : value;
        formDataToSend.append(key, formattedValue);
      }
    });

    // Append files if they exist
    if (founderIdFile) formDataToSend.append('founderId', founderIdFile);
    if (founderDocFile) formDataToSend.append('founderDocument', founderDocFile);
    if (bankDocFile) formDataToSend.append('bankDocument', bankDocFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const url = isUpdateMode
      ? `${BASE_URL}/verify/${user.userId}`
      : `${BASE_URL}/verify`;

    const method = isUpdateMode ? 'put' : 'post';

    console.log("Form data to be sent:", {
      ...formData,
      founderId: founderIdFile ? 'file present' : 'no file',
      founderDocument: founderDocFile ? 'file present' : 'no file',
      bankDocument: bankDocFile ? 'file present' : 'no file'
    });

    const response = await axios[method](url, formDataToSend, config);
    toast.success(`Organization ${isUpdateMode ? 'updated' : 'created'} successfully!`);

    if (isUpdateMode) {
      fetch();
    }
  } catch (error: any) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Error saving organization');
  } finally {
    setLoading(false);
  }
};

  if (pageLoading) {
    return <div className='flex justify-center items-center'><Loading/></div>
  }

  return (
    <div className="py-10 px-4 md:px-8">
      <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <p className={`absolute top-4 left-4 text-gray-500 cursor-pointer flex items-center px-2 py-1 rounded-full ${
          formData?.status === 'active' ? 'bg-green-300 text-green-800' : 
          formData?.status === 'suspended' ? 'bg-red-300 text-red-800' : 
          'bg-yellow-300 text-yellow-800'}`}>
          {formData?.status} 
          {formData?.status === 'active' && <FaCheckCircle className='inline-block ml-1' />} 
          {formData?.status === 'suspended' && <FaTimesCircle className='inline-block ml-1' />}
          {formData?.status === 'pending' && <FaClock className='inline-block ml-1' />} 
        </p>

        {formData?.status === 'rejected' && 
          <p className='mt-4 text-sm text-gray-600'>Please update your details to be active.</p>
        }

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Verification
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            label="Proof of id for founder/ceo/Bank Account Holder"
            onChange={(e) => handleFileChange(e, 'founderId')}
            previewUrl={founderIdPreview}
          />
          
          <FileUpload
            label="Supporting Document"
            onChange={(e) => handleFileChange(e, 'founderDocument')}
            previewUrl={founderDocPreview}
          />

          <div className="prose">
            <p>Examples of what documents to submit:</p>
            <ul className="list-disc pl-5">
              <li>A founding document/constitution</li>
              <li>NPO, NGO OR NPC certificate (if a charity)</li>
              <li>CIPC certificate (if a company)</li>
              <li>Registration certificate</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold">Banking Details</h3>
            <p className="text-sm text-gray-600">Required for payout</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Account holder Name" 
              name="accountHolderName" 
              value={formData.accountHolderName} 
              onChange={handleChange} 
              required 
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identification Type</label>
              <Select
                name="identificationType"
                value={formData.identificationType}
                onChange={handleChange}
                required
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>Select Identification Type</MenuItem>
                {identificationType.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </div>
            
            <Input 
              label="Identification Number" 
              name="identification" 
              value={formData.identification} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Reference" 
              name="reference" 
              value={formData.reference} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Account Number" 
              name="accountNo" 
              value={formData.accountNo} 
              onChange={handleChange} 
              required 
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <Select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>Select Account Type</MenuItem>
                {accountType.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Bank Name" 
              name="bankName" 
              value={formData.bankName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <p>Upload the necessary documents to prove validity of the banking details provided above.</p>
          <FileUpload
            label="Proof of Banking Details"
            onChange={(e) => handleFileChange(e, 'bankDocument')}
            previewUrl={bankDocPreview}
          />

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="crowdfund"
                checked={formData.crowdfund}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Have you crowdfunded before?</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="eventCrowdfund"
                checked={formData.eventCrowdfund}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Have you utilized events to crowdfund before? Eg. Comrades Marathon / Cape Argus</label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:scale-105 duration-300 transition-transform disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => void;
  required?: boolean;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
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

interface FileUploadProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, previewUrl }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="file"
      accept="image/*,.pdf,.doc,.docx"
      onChange={onChange}
      className="w-full mb-2"
    />
    {previewUrl && (
      <div className="mt-2">
        {/\.(pdf|doc|docx)$/i.test(previewUrl) ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            📄 Download Document
          </a>
        ) : (
          <img src={previewUrl} alt="Preview" className="h-24 object-contain border rounded-md shadow" />
        )}
      </div>
    )}
  </div>
);

export default VerificationOrganization;