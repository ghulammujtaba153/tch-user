import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import Loading from '../../components/Loading';
import { useAppConfig } from '../../context/AppConfigContext';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

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

  useEffect(() => {
    if (config?.name) {
      document.title = `S18A Document | ${config.name}`;
    }
  }, [config]);

  const fetchS18AData = async () => {
    const getFullUrl = (filePath: string) =>
      filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;
    
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
        status: res.data.status || 'pending'
      };

      setS18AData(s18ADataFromAPI);
      setIsUpdateMode(true);

      if (res.data.signature) setSignaturePreview(getFullUrl(res.data.signature));
    } catch (error) {
      console.log('No S18A data found for user');
      setS18AData({ ...initialS18AData, userId: user.userId });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchS18AData();
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG or PNG)');
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
      
      // Upload file using the upload function
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 's18a-documents');
      
      const uploadResult = await axios.post(`${BASE_URL}/upload/upload-single`, formData);
      
      if (uploadResult.data && uploadResult.data.filePath) {
        // Set the file path from the upload response
        setS18AData((prev) => ({ ...prev, signature: uploadResult.data.filePath }));
        
        // Create preview URL from the uploaded file
        const previewURL = `${SOCKET_URL}${uploadResult.data.filePath}`;
        setSignaturePreview(previewURL);
        
        // Clear the file object since we now have the path
        setSignatureFile(null);
        
        toast.success('Signature uploaded successfully!');
      } else {
        throw new Error('Upload failed - no file path returned');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
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
      toast.success(`S18A Document ${isUpdateMode ? 'updated' : 'saved'} successfully!`);
      
      if (isUpdateMode) {
        fetchS18AData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error saving S18A document');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-300 text-green-800';
      case 'rejected':
        return 'bg-red-300 text-red-800';
      case 'pending':
        return 'bg-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className='inline-block ml-1' />;
      case 'rejected':
        return <FaTimesCircle className='inline-block ml-1' />;
      case 'pending':
        return <FaClock className='inline-block ml-1' />;
      default:
        return null;
    }
  };

  if (pageLoading) {
    return <div className='flex justify-center items-center'><Loading /></div>
  }

    return (
    <div className="py-10 px-4 md:px-8">
      <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* Status Badge */}
        <p className={`absolute top-4 left-4 text-gray-500 cursor-pointer flex items-center px-2 py-1 rounded-full ${getStatusColor(s18AData.status)}`}>
          {s18AData.status} {getStatusIcon(s18AData.status)}
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          S18A Document Registration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Registration Toggle */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Are you S18A registered?
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="registered"
                  checked={s18AData.registered === true}
                  onChange={() => setS18AData({ ...s18AData, registered: true })}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="registered"
                  checked={s18AData.registered === false}
                  onChange={() => setS18AData({ ...s18AData, registered: false })}
                  className="mr-2"
                />
                No
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              S18A registration allows donors to claim tax deductions for their donations.
            </p>
          </div>

          {/* S18A Fields - Only show if registered */}
          {s18AData.registered && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">S18A Registration Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="mt-6">
                <FileUpload 
                  label="Signature Upload" 
                  onChange={handleFileChange} 
                  previewUrl={signaturePreview} 
                  required={!isUpdateMode}
                  isLoading={loading}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Upload your signature in PNG or JPG format. This will be used for official documents.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-secondary text-white px-6 py-2 rounded-md hover:scale-105 duration-300 transition-transform disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save S18A Details'}
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
        accept="image/png,image/jpg,image/jpeg"
        onChange={onChange}
        required={required}
        disabled={isLoading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
      
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-200 bg-gray-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-secondary hover:bg-gray-100'}`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col items-center">
              <img 
                src={previewUrl} 
                alt="Signature Preview" 
                className="w-24 h-24 object-cover rounded-lg border shadow-sm mb-2" 
              />
              <p className="text-sm font-medium text-gray-700">Signature Uploaded</p>
              <p className="text-xs text-gray-500">Click to change</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG up to 10MB
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
          className="text-xs text-red-600 hover:text-red-800 underline"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);
    


export default S18ADocument;