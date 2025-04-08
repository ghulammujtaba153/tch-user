import React, { useState, useRef } from 'react';
// import { GrCloudUpload } from 'react-icons/gr';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const Support = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        phone: '',
        existingProject: '',
        department: '',
        subject: '',
        message: '',
        file: null
    });

    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files.length > 0) {
            setFileName(files[0].name);
            setFormData(prev => ({
                ...prev,
                file: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Form submitted successfully!');
    };

    const handleDiscard = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            phone: '',
            existingProject: '',
            department: '',
            subject: '',
            message: '',
            file: null
        });
        setFileName('');
    };

    const handleRemoveFile = () => {
        setFormData(prev => ({ ...prev, file: null }));
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='pt-20 min-h-screen' style={{ backgroundColor: '#DFEEFD' }}>
            <div className='max-w-[800px] bg-white border border-gray-200 py-8 rounded-[20px] mx-auto px-6 shadow-md'>
                <h1 className='text-2xl font-bold text-center text-gray-800'>We're here for you</h1>
                <div className='w-full flex items-center justify-center mt-4'>
                    <p className='max-w-[500px] text-center text-gray-500 mt-2'>
                        Need help? Our team of Customer Support Specialists is here to guide you throughout your crowdfunding journey.
                    </p>
                </div>

                {/* Contact info */}
                <div className='flex flex-col md:flex-row text-gray-500 items-center justify-center mt-8 gap-10'>
                    <div className='flex flex-col items-center gap-2'>
                        <p>Phone Call</p>
                        <p className='text-blue-600 font-bold'>+1 (123) 456-7890</p>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <p>Email</p>
                        <p className='text-blue-600 font-bold'>support@crowdfund.com</p>
                    </div>
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
                                className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label htmlFor="lastName" className='font-medium'>Last Name*</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                            />
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
                                className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label htmlFor="confirmEmail" className='font-medium'>Confirm Email*</label>
                            <input
                                type="email"
                                name="confirmEmail"
                                id="confirmEmail"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                            />
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

                    {/* Project radio buttons */}
                    <div className='flex flex-col gap-2'>
                        <label className='font-medium'>Do you have any existing project?*</label>
                        <div className='flex gap-6 mt-1'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    name='existingProject'
                                    id='yes'
                                    value="yes"
                                    checked={formData.existingProject === 'yes'}
                                    onChange={handleChange}
                                    className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                                    required
                                />
                                <label htmlFor="yes">Yes</label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='radio'
                                    name='existingProject'
                                    id='no'
                                    value="no"
                                    checked={formData.existingProject === 'no'}
                                    onChange={handleChange}
                                    className='h-4 w-4 text-blue-600 focus:ring-blue-500'
                                />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                    </div>

                    {/* Department and subject */}
                    <div className='flex flex-col md:flex-row w-full gap-4'>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label htmlFor="department" className='font-medium'>Select the department*</label>
                            <select
                                name="department"
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                                className='border bg-transparent rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                            >
                                <option value="">Select option</option>
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing</option>
                                <option value="general">General Inquiry</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label htmlFor="subject" className='font-medium'>Subject*</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="message" className='font-medium'>Query Description*</label>
                        {/* <textarea
                            name="message"
                            id="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            className='border border-gray-300 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        /> */}
                    </div>

                    {/* File upload - Improved design */}
                    <div className='flex flex-col gap-2'>
                        <label className='font-medium'>Upload Screenshot (Optional)</label>
                        <div 
                            className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors 
                                ${fileName ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                            onClick={handleUploadClick}
                        >
                            <input
                                type="file"
                                name="file"
                                id="file"
                                ref={fileInputRef}
                                onChange={handleChange}
                                className='hidden'
                                accept="image/*"
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
                                                handleRemoveFile();
                                            }}
                                            className='text-red-500 hover:text-red-700'
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className='text-sm text-gray-600'>
                                            <span className='text-blue-600 font-medium'>upload</span> or drag and drop
                                        </p>
                                        
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                        <button
                            type="submit"
                            className='bg-secondary text-white rounded-full py-3 px-6 hover:scale-105 transition-trnaform duration-300 font-medium'
                        >
                            SUBMIT QUERY
                        </button>
                        <button
                            type="button"
                            onClick={handleDiscard}
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