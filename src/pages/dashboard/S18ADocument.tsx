import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import Loading from '../../components/Loading';
import { useAppConfig } from '../../context/AppConfigContext';
import { FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import upload from '../../utils/upload';

const initialS18AData = {
  userId: '',
  registered: false,
  reference: '',
  trustNumber: '',
  pbo: '',
  npo: '',
  signature: '',
  status: 'pending'
};

const S18ADocument = () => {
  const [s18AData, setS18AData] = useState<any>(initialS18AData);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { user } = useContext<any>(AuthContext);
  const { config } = useAppConfig();
  const [issues, setIssues] = useState<any>([]);

  // Helper function to construct full URL for file paths
  const getFullUrl = (filePath: string) =>
    filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

  useEffect(() => {
    if (config?.name) {
      document.title = `S18A Document | ${config.name}`;
    }
  }, [config]);

  const fetchS18AData = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/s18a/get/${user.userId}`);
      console.log("fetch S18A data", res.data);
      
     

      const s18ADataFromAPI = {
        userId: user?.userId,
        registered: res.data.registered || false,
        reference: res.data.reference || '',
        trustNumber: res.data.trustNumber || '',
        pbo: res.data.pbo || '',
        npo: res.data.npo || '',
        signature: res.data.signature || '',
        status: res.data.status || ""
      };

      setS18AData(s18ADataFromAPI);
      setIsUpdateMode(true);

      // Set signature preview - handle both Cloudinary URLs and local file paths
      if (res.data.signature) {
        const signatureUrl = res.data.signature.startsWith('http') ? res.data.signature : getFullUrl(res.data.signature);
        setSignaturePreview(signatureUrl);
      }
    } catch (error) {
      console.log('No S18A data found for user');
      setS18AData({ ...initialS18AData, userId: user.userId, status: "" });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchIssues = async()=>{
    setPageLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/issue-report/${user.userId}?type=s18aDocuments`)
      console.log("fetch issues in s18a document", res.data)
      if(res.data.type == "s18aDocuments"){
        setIssues(res.data)
      }
    } catch (error) {
      toast.error("error while fetching issue")
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (user?.userId) {
      fetchS18AData();
      fetchIssues()
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setS18AData({ ...s18AData, [name]: value });
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setS18AData({ ...s18AData, [name]: checked });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setSignatureFile(null);
      setSignaturePreview(null);
      setS18AData((prev) => ({ ...prev, signature: '' }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    try {
      // Show loading state
      setLoading(true);
      
      // Upload file to Cloudinary using the upload utility
      toast.loading("Uploading signature...");
      const url = await upload(file);
      toast.dismiss();
      
      if (url) {
        // Set the Cloudinary URL (which is already a full URL)
        setS18AData((prev) => ({ ...prev, signature: url }));
        
        // Set preview URL directly (Cloudinary URLs are already full URLs)
        setSignaturePreview(url);
        
        // Clear the file object since we now have the URL
        setSignatureFile(null);
        
        toast.success('Signature uploaded successfully!');
        console.log('Cloudinary signature uploaded:', url);
      } else {
        throw new Error('Upload failed - no URL returned from Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading signature to Cloudinary:', error);
      toast.error('Error uploading signature file');
      
      // Reset state on error
      setSignatureFile(null);
      setSignaturePreview(null);
      setS18AData((prev) => ({ ...prev, signature: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...s18AData,
        userId: user.userId
      };

      const config = { headers: { 'Content-Type': 'application/json' } };
      const url = isUpdateMode ? `${BASE_URL}/s18a/update/${user.userId}` : `${BASE_URL}/s18a/create`;
      const method = isUpdateMode ? 'put' : 'post';

      const response = await axios[method](url, dataToSend, config);
      toast.success(`S18A Document Submitted For Review!`);
      
      if (isUpdateMode) {
        fetchS18AData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error Submitting S18A Document');
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
    <div className="min-h-screen  py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
              S18A Document Registration
            </h1>
            
            {/* Status Badge */}
            {s18AData.status && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(s18AData.status)}`}>
                {s18AData.status.charAt(0).toUpperCase() + s18AData.status.slice(1)}
                {getStatusIcon(s18AData.status)}
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm sm:text-base">
            S18A registration allows donors to claim tax deductions for their donations to your organization.
          </p>
        </div>

        {/* Issues Alert - Show if rejected */}
        {s18AData.status === "rejected" && issues?.issue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Issues Found with Your Submission
                </h3>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Please address the following issues:</p>
                  <div className="bg-white border border-red-200 rounded-md p-3">
                    <p className="font-medium">Issue:</p>
                    <p className="mt-1">{issues.issue}</p>
                  </div>
                  <p className="mt-2 text-xs">
                    Please make the necessary corrections and resubmit your document.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Registration Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Are you S18A registered?
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="registered"
                    checked={s18AData.registered === true}
                    onChange={() => setS18AData({ ...s18AData, registered: true })}
                    className="mr-2 h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="registered"
                    checked={s18AData.registered === false}
                    onChange={() => setS18AData({ ...s18AData, registered: false })}
                    className="mr-2 h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* S18A Fields - Only show if registered */}
            {s18AData.registered && (
              <div className="space-y-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  S18A Registration Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Input 
                    label="Reference" 
                    name="reference" 
                    value={s18AData.reference} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="Trust Number" 
                    name="trustNumber" 
                    value={s18AData.trustNumber} 
                    onChange={handleChange} 
                    required 
                  />
                  <Input 
                    label="PBO" 
                    name="pbo" 
                    value={s18AData.pbo} 
                    onChange={handleChange} 
                  />
                  <Input 
                    label="NPO" 
                    name="npo" 
                    value={s18AData.npo} 
                    onChange={handleChange} 
                  />
                </div>

                {/* Signature Upload */}
                <div className="col-span-full">
                  <FileUpload 
                    label="Signature Upload" 
                    onChange={handleFileChange} 
                    previewUrl={signaturePreview} 
                    required={!isUpdateMode}
                    isLoading={loading}
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Upload your signature in PNG, JPG, or WebP format. This will be used for official documents.
                  </p>
                </div>
              </div>
            )}

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
                  'Save S18A Details'
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

const FileUpload = ({
  label,
  onChange,
  previewUrl,
  required = false,
  isLoading = false,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  required?: boolean;
  isLoading?: boolean;
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    <div className="relative">
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onChange}
        required={required}
        disabled={isLoading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
      
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 ${
        isLoading 
          ? 'opacity-50 cursor-not-allowed bg-gray-50' 
          : 'hover:border-secondary hover:bg-gray-50 cursor-pointer'
      }`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-secondary"></div>
              </div>
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col items-center">
              <img 
                src={previewUrl} 
                alt="Signature Preview" 
                className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg border shadow-sm mb-2" 
              />
              <p className="text-sm font-medium text-gray-700">Signature Uploaded</p>
              <p className="text-xs text-gray-500">Click to change</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    
    {previewUrl && (
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          File uploaded successfully
        </span>
        <button
          type="button"
          onClick={() => {
            // Clear the file input
            const fileInput = document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`) as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            // Trigger change event to clear preview
            const event = new Event('change', { bubbles: true });
            fileInput?.dispatchEvent(event);
          }}
          className="text-xs text-red-600 hover:text-red-800 underline transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);

export default S18ADocument;