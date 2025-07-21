import React, { useEffect, useState, useContext } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import AddMember from '../../components/dashboard/AddMember';
import Loading from '../../components/Loading';
import DonationBtn from '../../components/dashboard/DonationBtn';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { useAppConfig } from '../../context/AppConfigContext';

const initialFormData = {
  userId: '',
  name: '',
  description: '',
  logo: '',
  address: '',
  phone: '',
  email: '',
  registrationNumber: '',
  vatNumber: '',
  emisNumber: '',
  organizationType: '',
  socialMediaLinks: [''],
  status: ""
};

const Organization = () => {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { user } = useContext<any>(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isses, setIssues] = useState<any>("");
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Organization | ${config.name}`;
    }
  }, [config]);


  const fetchOrganization = async () => {
    const getFullUrl = (filePath: string) =>
      filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;
    try {
      let res = await axios.get(`${BASE_URL}/organization/${user.userId}`);
      console.log("fetch organization", res.data);
      setOrganization(res.data);
      if (!res?.data) {
        console.log("second way")

        res = await axios.post(`${BASE_URL}/member/email`, {
          email: user?.email,
        });

        res = await axios.get(`${BASE_URL}/organization/orgId/${res.data.organization}`);
      }
      const mergedData = {
        ...initialFormData,
        name: res.data.name || '',
        description: res.data.description || '',
        logo: res.data.logo || '',
        address: res.data.address || res.data.address1 || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        registrationNumber: res.data.registrationNumber || '',
        vatNumber: res.data.vatNumber || '',
        emisNumber: res.data.emisNumber || '',
        organizationType: res.data.organizationType || '',
        socialMediaLinks: res.data.socialMediaLinks ?? [''],
        status: res.data.status || '',
        userId: user?.userId,
      };
      setFormData(mergedData);
      setIsUpdateMode(true);

      if (res.data.logo) setLogoPreview(getFullUrl(res.data.logo));

    } catch (error) {
      console.log('No organization data found for user');
      setFormData({ ...initialFormData, userId: user.userId });
      setIsUpdateMode(false);
    } finally {
      setPageLoading(false);
    }
  };


  const fetchIssues = async()=>{
    try {
      const res = await axios.get(`${BASE_URL}/issue-report/${user.userId}`)
      setIssues(res.data)
    } catch (error) {
      toast.error("error while fetching issue")
    }
  }


  useEffect(()=>{
    if(formData.status== "rejected"){
      fetchIssues()
    }
  },[formData.status])

  useEffect(() => {
    if (user?.userId) {
      fetchOrganization();
    }
  }, [user]);

  // Cleanup blob URLs on unmount (for any existing blob URLs from previous implementation)
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === 'socialMediaLinks' && index !== undefined) {
      const updatedLinks = [...formData.socialMediaLinks];
      updatedLinks[index] = value;
      setFormData({ ...formData, socialMediaLinks: updatedLinks });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpload = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await axios.post(`${BASE_URL}/upload/upload-single`, formData);
    return res.data;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo'
  ) => {
    const file = e.target.files?.[0];
    
    // If no file is selected, clear the preview and file
    if (!file) {
      setLogoFile(null);
      setLogoPreview(null);
      setFormData((prev) => ({ ...prev, logo: '' }));
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
      
      // Upload file using the upload function
      const uploadResult = await handleUpload(file, 'logo');
      
      if (uploadResult && uploadResult.filePath) {
        // Set the file path from the upload response
        setFormData((prev) => ({ ...prev, logo: uploadResult.filePath }));
        
        // Create preview URL from the uploaded file
        const previewURL = `${SOCKET_URL}${uploadResult.filePath}`;
      setLogoPreview(previewURL);
        
        // Clear the file object since we now have the path
        setLogoFile(null);
        
        toast.success('Logo uploaded successfully!');
      } else {
        throw new Error('Upload failed - no file path returned');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading logo file');
      
      // Reset state on error
      setLogoFile(null);
      setLogoPreview(null);
      setFormData((prev) => ({ ...prev, logo: '' }));
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare data for submission
      const dataToSend = {
        ...formData,
        socialMediaLinks: formData.socialMediaLinks.filter((link: string) => link.trim() !== '')
      };

      // Remove status for new organizations
      if (!isUpdateMode) {
        delete dataToSend.status;
      }

      const config = { headers: { 'Content-Type': 'application/json' } };
      const url = isUpdateMode ? `${BASE_URL}/organization/${user.userId}` : `${BASE_URL}/organization`;
      const method = isUpdateMode ? 'put' : 'post';

      const response = await axios[method](url, dataToSend, config);
      toast.success(`Organization ${isUpdateMode ? 'updated' : 'created'} successfully!`);
      if (isUpdateMode) fetchOrganization();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error saving organization');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (pageLoading) {
    return <div className='flex justify-center items-center'><Loading /></div>
  }

  return (
    <div className="py-10 px-4 md:px-8">
      <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <p className={`absolute top-4 left-4 text-gray-500 cursor-pointer flex items-center  px-2 py-1 rounded-full ${formData?.status === 'active' ? 'bg-green-300 text-green-800' : formData?.status === 'suspended' ? 'bg-red-300 text-red-800' : 'bg-yellow-300 text-yellow-800'}`}>
          {formData?.status} {formData?.status === 'active' && <FaCheckCircle className='inline-block ml-1' />} {formData?.status === 'suspended' && <FaTimesCircle className='inline-block ml-1' />}
          {formData?.status === 'pending' && <FaClock className='inline-block ml-1' />}
        </p>

        {formData?.status === 'rejected' &&
        <>
          <p className='mt-4 text-sm text-gray-600'>Please update your details to be active.</p>
          <p className='mt-4 text-sm font-bold text-gray-600'>{isses.issue}</p>
        </>
        }

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isUpdateMode ? 'Update Organization' : 'Organization Registration'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organization Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Organization Details</h3>
            <p className="text-gray-500 mb-4 text-sm">Basic information about your organization.</p>
            
            {/* Organization Logo */}
            <div className="mb-6">
              <FileUpload 
                label="Organization Logo" 
                onChange={(e) => handleFileChange(e, 'logo')} 
                previewUrl={logoPreview} 
                required={!isUpdateMode}
                isLoading={loading}
              />
              <p className='text-gray-600 text-sm mt-2'>An image speaks a thousand words! Try to upload your organisation's logo, or an image which gives donors a sense of your organisation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization Name */}
              <Input label="Organization Name" name="name" value={formData.name} onChange={handleChange} required />
              
              {/* Organization Type */}
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Select Organization Type</option>
                <option value="public">Public</option>
                <option value="independent/private">Independent/Private</option>
                <option value="specialised">Specialised</option>
                <option value="early-childhood-development">Early Childhood Development</option>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="school">School</option>
                <option value="technical">Technical</option>
                <option value="ngo">NGO</option>
                <option value="charity">Charity</option>
                <option value="foundation">Foundation</option>
              </select>

              {/* Registration Number */}
              <Input label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} />
              
              {/* VAT Number */}
             <Input label="VAT Number" name="vatNumber" value={formData.vatNumber} onChange={handleChange} />
              
              {/* EMIS Number */}
             <Input label="EMIS Number" name="emisNumber" value={formData.emisNumber} onChange={handleChange} />

              {/* Email */}
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              
              {/* Contact Number */}
              <Input label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            {/* Address */}
            <div className="mt-4">
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            {/* Organization Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Describe your organization's mission, vision, and activities..."
              />
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
              {formData.socialMediaLinks.map((link, idx) => (
                <input
                  key={idx}
                  name="socialMediaLinks"
                  value={link}
                  onChange={(e) => handleChange(e, idx)}
                  placeholder={`Social media link #${idx + 1}`}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
              ))}
              <button 
                type="button" 
                onClick={addSocialLink} 
                className="text-blue-600 text-sm hover:underline mt-1"
              >
                + Add Another Link
              </button>
            </div>
          </div>

          {/* Submit Button */}
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

      {/* {user?.organization?.role == "owner" && <AddMember />}
      {user?.organization?.role == "owner" && <DonationBtn organizationId={organization?._id} />} */}

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
  onRemove,
  isUpdateMode = false,
  isLoading = false,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  required?: boolean;
  onRemove?: () => void;
  isUpdateMode?: boolean;
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
                alt="Preview" 
                className="w-24 h-24 object-contain rounded-lg border shadow-sm mb-2 bg-white" 
              />
              <p className="text-sm font-medium text-gray-700">Logo Uploaded</p>
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
          className="text-xs text-red-600 hover:text-red-800 underline"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);

export default Organization;
