import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
// import { BASE_URL } from '../config/url';
import ReactGA from 'react-ga4';
// import ScrollToTop from '../utils/ScrollToTop';
import { useAppConfig } from '../../context/AppConfigContext';
import ScrollToTop from '../../utils/ScrollToTop';
import { BASE_URL } from '../../config/url';


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  existingProject: string;
  department: string;
  enquiryType: string;
  subject: string;
  message: string;
  image: File | null;
  file: File | null;
}

const Support = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    existingProject: '',
    department: '',
    enquiryType: '',
    subject: '',
    message: '',
    image: null,
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [imageName, setImageName] = useState('');
  const [fileName, setFileName] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { config } = useAppConfig();

  // Enquiry type options
  const enquiryTypes = [
    'Donor / Donation',
    'Campaign',
    'General Enquiry',
    'Media',
    'Report Fraud',
    'Support'
  ];

  useEffect(() => {
    if (config?.name) {
      document.title = `Support | ${config.name}`;
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === 'image') {
        setImageName(file.name);
        setFormData(prev => ({ ...prev, image: file }));
      } else {
        setFileName(file.name);
        setFormData(prev => ({ ...prev, file: file }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
  
      const res = await axios.post(`${BASE_URL}/support`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      ReactGA.event({
        category: 'Support',
        action: 'Submitted Support Request',
        label: 'Support Form Submission',
      });
      
      console.log(res.data);
      alert('Your support request has been submitted successfully!');
      handleDiscard();
    } catch (error) {
      console.error(error);
      alert('Failed to submit support request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phone: '',
      existingProject: 'no',
      department: '',
      enquiryType: '',
      subject: '',
      message: '',
      image: null,
      file: null
    });
    setImageName('');
    setFileName('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (type: 'image' | 'file') => {
    if (type === 'image') {
      setFormData(prev => ({ ...prev, image: null }));
      setImageName('');
      if (imageInputRef.current) imageInputRef.current.value = '';
    } else {
      setFormData(prev => ({ ...prev, file: null }));
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className='pt-20 min-h-screen px-4'>
      <ScrollToTop />
      <div className='max-w-[800px] bg-white border border-gray-200 py-8 rounded-[20px] mx-auto px-6 shadow-md mb-10'>
        <h1 className='text-2xl font-bold text-center text-gray-800'>We're here for you!</h1>
        <div className='w-full flex items-center justify-center mt-4'>
          <p className='max-w-[500px] text-center text-gray-500 mt-2'>
            Need help? Our team of Customer Support Specialists is here to guide you throughout your crowdfunding journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='mt-8 text-gray-700 flex flex-col gap-6'>
          {/* Name fields */}
          <div className='flex flex-col md:flex-row w-full gap-4'>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="firstName" className='font-medium'>First Name*</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="lastName" className='font-medium'>Last Name*</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email fields */}
          <div className='flex flex-col md:flex-row w-full gap-4'>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="email" className='font-medium'>Email*</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="confirmEmail" className='font-medium'>Confirm Email*</label>
              <input
                type="email"
                name="confirmEmail"
                id="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                className={`border ${errors.confirmEmail ? 'border-red-500' : 'border-gray-300'} rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.confirmEmail && <p className="text-red-500 text-sm">{errors.confirmEmail}</p>}
            </div>
          </div>

          {/* Phone field */}
          <div className='flex flex-col md:flex-row w-full gap-4'>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="phone" className='font-medium'>Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Department and Enquiry Type */}
          <div className='flex flex-col md:flex-row w-full gap-4'>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="department" className='font-medium'>Select the department*</label>
              <select
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className={`border ${errors.department ? 'border-red-500' : 'border-gray-300'} bg-transparent rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="">Select option</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing</option>
                <option value="general">General Inquiry</option>
              </select>
              {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
            </div>
            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="enquiryType" className='font-medium'>Enquiry Type*</label>
              <select
                name="enquiryType"
                id="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
                className={`border ${errors.enquiryType ? 'border-red-500' : 'border-gray-300'} bg-transparent rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="">Select enquiry type</option>
                {enquiryTypes.map((type) => (
                  <option key={type} value={type.toLowerCase().replace(' ', '_')}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.enquiryType && <p className="text-red-500 text-sm">{errors.enquiryType}</p>}
            </div>
          </div>

          {/* Subject */}
          <div className='flex flex-col gap-2'>
            <label htmlFor="subject" className='font-medium'>Subject*</label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div className='flex flex-col gap-2'>
            <label htmlFor="message" className='font-medium'>Query Description*</label>
            <textarea
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          {/* Image upload */}
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Upload Screenshot or Any Image (Optional)</label>
            <div 
              className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors 
                ${imageName ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              onClick={() => imageInputRef.current?.click()}
            >
              <input
                type="file"
                name="image"
                ref={imageInputRef}
                onChange={(e) => handleFileChange(e, 'image')}
                className='hidden'
                accept="image/*"
              />
              <div className='flex flex-col items-center justify-center gap-2'>
                <FiUploadCloud className='text-3xl text-blue-500' />
                {imageName ? (
                  <div className='flex items-center gap-2 mt-2'>
                    <span className='text-sm text-gray-700 truncate max-w-xs'>{imageName}</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile('image');
                      }}
                      className='text-red-500 hover:text-red-700'
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className='text-sm text-gray-600'>
                      <span className='text-blue-600 font-medium'>Upload</span> or drag and drop
                    </p>
                    <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* File upload */}
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Upload Any Other File (Optional)</label>
            <div 
              className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors 
                ${fileName ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                name="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, 'file')}
                className='hidden'
              />
              <div className='flex flex-col items-center justify-center gap-2'>
                <FiUploadCloud className='text-3xl text-blue-500' />
                {fileName ? (
                  <div className='flex items-center gap-2 mt-2'>
                    <span className='text-sm text-gray-700 truncate max-w-xs'>{fileName}</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile('file');
                      }}
                      className='text-red-500 hover:text-red-700'
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className='text-sm text-gray-600'>
                      <span className='text-blue-600 font-medium'>Upload</span> or drag and drop
                    </p>
                    <p className='text-xs text-gray-500'>PDF, DOC, ZIP up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 mt-4'>
            <button
              type="submit"
              disabled={loading}
              className={`bg-secondary text-white rounded-full py-3 px-6 hover:scale-105 transition-transform duration-300 font-medium flex items-center justify-center ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'SUBMIT QUERY'}
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={loading}
              className='text-secondary border border-secondary rounded-full py-3 px-6 hover:bg-blue-50 transition-colors duration-300 font-medium'
            >
              DISCARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;