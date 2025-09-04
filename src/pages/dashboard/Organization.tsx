import React, { useEffect, useState, useContext } from 'react';
import upload from '../../utils/upload';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../context/userContext';
import AddMember from '../../components/dashboard/AddMember';
import Loading from '../../components/Loading';
import DonationBtn from '../../components/dashboard/DonationBtn';
import { FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAppConfig } from '../../context/AppConfigContext';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const initialFormData = {
  userId: '',
  name: '',
  description: '',
  logo: '',
  address: '',
  longitude: null,
  latitude: null,
  phone: '',
  email: '',
  registrationNumber: '',
  vatNumber: '',
  emisNumber: '',
  organizationType: 'education',
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
  const [isEditable, setIsEditable] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-26.2041, 28.0473]); // Default to Johannesburg, SA
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [geocodingTimeout, setGeocodingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Helper function to construct full URL for file paths
  const getFullUrl = (filePath: string) =>
    filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return null;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lat, lon] as [number, number];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Debounced geocoding function
  const debouncedGeocode = (address: string) => {
    if (geocodingTimeout) {
      clearTimeout(geocodingTimeout);
    }
    
    const timeout = setTimeout(async () => {
      if (address.length > 10) {
        const coordinates = await geocodeAddress(address);
        if (coordinates) {
          setMapCenter(coordinates);
          setMarkerPosition(coordinates);
          // Update form data with coordinates
          setFormData(prev => ({
            ...prev,
            latitude: coordinates[0],
            longitude: coordinates[1]
          }));
        }
      }
    }, 1000); // Wait 1 second after user stops typing
    
    setGeocodingTimeout(timeout);
  };

  useEffect(() => {
    if (config?.name) {
      document.title = `Organization | ${config.name}`;
    }
  }, [config]);

  const fetchOrganization = async () => {
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
      
      // Extract coordinates from response
      const latitude = res.data.latitude || res.data.location?.coordinates?.[1] || null;
      const longitude = res.data.longitude || res.data.location?.coordinates?.[0] || null;
      
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
        latitude: latitude,
        longitude: longitude
      };
      
      setFormData(mergedData);
      setIsUpdateMode(true);

      // Set logo preview - handle both Cloudinary URLs and local file paths
      if (res.data.logo) {
        const logoUrl = res.data.logo.startsWith('http') ? res.data.logo : getFullUrl(res.data.logo);
        setLogoPreview(logoUrl);
      }

      // Set map position based on coordinates or address
      if (latitude && longitude) {
        const coordinates = [latitude, longitude] as [number, number];
        setMapCenter(coordinates);
        setMarkerPosition(coordinates);
      } else if (res.data.address || res.data.address1) {
        const address = res.data.address || res.data.address1;
        const coordinates = await geocodeAddress(address);
        if (coordinates) {
          setMapCenter(coordinates);
          setMarkerPosition(coordinates);
        }
      }

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
      const res = await axios.get(`${BASE_URL}/issue-report/${user.userId}?type=organization`)
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (geocodingTimeout) {
        clearTimeout(geocodingTimeout);
      }
    };
  }, [geocodingTimeout]);

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

  // Handle marker drag end to update coordinates
  const handleMarkerDragEnd = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    const newPosition: [number, number] = [lat, lng];
    
    setMarkerPosition(newPosition);
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleUpload = async (file: File) => {
    try {
      toast.loading("Uploading file...");
      const url = await upload(file);
      toast.dismiss();
      if (url) {
        toast.success("File uploaded successfully");
        console.log("Cloudinary URL:", url);
        return { url, filePath: url }; // Return both for compatibility
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (error) {
      console.log("error while uploading file", error);
      toast.dismiss();
      toast.error("Error while uploading file");
      return null;
    }
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
      
      // Upload file to Cloudinary using the upload utility
      const uploadResult = await handleUpload(file);
      
      if (uploadResult && uploadResult.url) {
        // Set the Cloudinary URL (which is already a full URL)
        setFormData((prev) => ({ ...prev, logo: uploadResult.url }));
        
        // Set preview URL directly (Cloudinary URLs are already full URLs)
        setLogoPreview(uploadResult.url);
        
        // Clear the file object since we now have the URL
        setLogoFile(null);
        
        console.log('Cloudinary logo uploaded:', uploadResult.url);
      } else {
        throw new Error('Upload failed - no URL returned from Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
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
      toast.success(`Organization Details Submitted For Review!`);
      if (isUpdateMode) fetchOrganization();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error Submitting Organization');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
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
      case 'active':
        return <FaCheckCircle className='inline-block ml-1 text-sm' />;
      case 'suspended':
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
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4 sm:p-6 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
              {isUpdateMode ? 'Update Organisation' : 'Organisation Registration'}
            </h1>
            {/* Status Badge */}
            {formData?.status && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(formData.status)}`}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                {getStatusIcon(formData.status)}
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            {isUpdateMode 
              ? "Update your organisation details to keep your profile current." 
              : "Register your organisation to start accepting donations and managing campaigns."
            }
          </p>
        </div>

        {/* Issues Alert - Show if rejected */}
        {formData?.status === 'rejected' && isses?.issue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Issues Found with Your Organisation Details
                </h3>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Please address the following issues to activate your organization:</p>
                  <div className="bg-white border border-red-200 rounded-md p-3">
                    <p className="font-medium">Issue:</p>
                    <p className="mt-1">{isses.issue}</p>
                  </div>
                  <p className="mt-2 text-xs">
                    Please update your details and resubmit for review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="relative bg-white shadow-sm rounded-lg p-4 sm:p-6 lg:p-8">

          {/* Edit Organisation Button */}
          <button
            className="absolute top-4 right-4 bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 transition"
            onClick={() => setIsEditable(true)}
            disabled={isEditable}
          >
            Edit Organisation
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Organization Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Organisation Details</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4">Basic information about your organisation.</p>
              </div>
              
              {/* Organization Logo */}
              <div className="col-span-full">
                <FileUpload 
                  label="Organisation Logo" 
                  onChange={(e) => handleFileChange(e, 'logo')} 
                  previewUrl={logoPreview} 
                  required={!isUpdateMode}
                  isLoading={loading}
                  disabled={!isEditable ? true : false}
                />
                <p className='text-gray-500 text-xs sm:text-sm mt-2'>
                  An image speaks a thousand words! Try to upload your organisation's logo, or an image which gives donors a sense of your organisation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Organization Name */}
                <Input label="Organisation Name" name="name" value={formData.name} onChange={handleChange} required disabled={!isEditable} />
                
                {/* Organization Type */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Organisation Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleSelectChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                    required
                    disabled={!isEditable}
                  >
                    <option value="">Select Organisation Type</option>
                    <option value="public">Public</option>
                    <option value="independent/private">Independent/Private</option>
                    <option value="specialised">Specialised</option>
                    <option value="early-childhood-development">Early Childhood Development</option>
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="school">School</option>
                    <option value="technical">Technical</option>
                    
                  </select>
                </div>

                {/* Registration Number */}
                <Input label="Company / Trust Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} disabled={!isEditable} />
                
                {/* VAT Number */}
                <Input label="VAT Number" name="vatNumber" value={formData.vatNumber} onChange={handleChange} disabled={!isEditable} />
                
                {/* EMIS Number */}
                <Input label="NATEMIS / EMIS Number" name="emisNumber" value={formData.emisNumber} onChange={handleChange} disabled={!isEditable} />

                {/* Email */}
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={!isEditable} />
                
                {/* Contact Number */}
                <PhoneInput
                  country={'za'}
                  value={formData.phone}
                  onChange={(phone) => handleChange({target: {name: "phone", value: phone}} as any)}
                  enableSearch={true}
                  inputClass="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                />
                
              </div>

              {/* Address */}
              <div className="col-span-full space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Organization Address <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) => {
                    handleChange(e);
                    // Use debounced geocoding
                    debouncedGeocode(e.target.value);
                  }}
                  required
                  disabled={!isEditable}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                  placeholder="Enter your organization's full address"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the complete address to show your organization's location on the map below
                </p>
              </div>

              {/* Map Component */}
              <div className="col-span-full space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Location
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: "300px", width: "100%" }}
                    key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when center changes
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    />
                    {markerPosition && (
                      <Marker
                        position={markerPosition}
                        draggable={isEditable}
                        eventHandlers={{
                          dragend: handleMarkerDragEnd
                        }}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong>{formData.name || 'Organization Location'}</strong>
                            {formData.address && (
                              <div className="text-sm text-gray-600 mt-1">
                                {formData.address}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Drag marker to adjust location
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {isEditable 
                    ? "The map will update when you enter an address. You can also drag the marker to adjust the location." 
                    : "Organization location on map"}
                </p>
                
                {/* Display coordinates if available */}
                {(formData.latitude && formData.longitude) && (
                  <div className="text-xs text-gray-500 mt-1">
                    Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </div>
                )}
              </div>

              {/* Organization Description */}
              <div className="col-span-full space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Organisation Description <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe your organisation's mission, vision, and activities..."
                  disabled={!isEditable}
                />
              </div>

              {/* Social Media Links */}
              <div className="col-span-full space-y-3">
                <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
                <div className="space-y-2">
                  {formData.socialMediaLinks.map((link, idx) => (
                    <input
                      key={idx}
                      name="socialMediaLinks"
                      value={link}
                      onChange={(e) => handleChange(e, idx)}
                      placeholder={`Social media link #${idx + 1}`}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                      disabled={!isEditable}
                    />
                  ))}
                  <button 
                    type="button" 
                    onClick={addSocialLink} 
                    className="text-secondary text-sm hover:text-secondary/80 transition-colors duration-200 font-medium"
                    disabled={!isEditable}
                  >
                    + Add Another Link
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={loading || !isEditable} 
                className="w-full sm:w-auto bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
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
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  disabled?: boolean;
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
      disabled={disabled}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
      placeholder={`Enter ${label.toLowerCase()}`}
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
  disabled = false,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  required?: boolean;
  onRemove?: () => void;
  isUpdateMode?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
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
        disabled={isLoading || disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-200 ${
        isLoading || disabled
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
                alt="Preview" 
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded-lg border shadow-sm mb-2 bg-white" 
              />
              <p className="text-sm font-medium text-gray-700">Logo Uploaded</p>
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
          disabled={disabled}
        >
          Remove
        </button>
      </div>
    )}
  </div>
);

export default Organization;