import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const Security = () => {
    // State to manage password visibility for each field
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    return (
        <div className='flex flex-col md:flex-row justify-between gap-8 md:gap-4 p-4'>
            {/* Left Section - Change Password */}
            <div className='flex flex-col gap-4 flex-1'>
                <h1 className='text-2xl font-bold text-[#BEE36E]'>Change Password</h1>

                {/* Old Password Field */}
                <div>
                    <label htmlFor="oldPassword" className='text-sm text-gray-500'>Old Password</label>
                    <div className='relative'>
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder='Enter Password'
                            className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BEE36E] pr-10'
                        />
                        <button
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                        >
                            {showOldPassword ? (
                                <EyeSlashIcon className='w-5 h-5 text-gray-500' />
                            ) : (
                                <EyeIcon className='w-5 h-5 text-gray-500' />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password Field */}
                <div>
                    <label htmlFor="newPassword" className='text-sm text-gray-500'>New Password</label>
                    <div className='relative'>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder='Enter Password'
                            className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BEE36E] pr-10'
                        />
                        <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                        >
                            {showNewPassword ? (
                                <EyeSlashIcon className='w-5 h-5 text-gray-500' />
                            ) : (
                                <EyeIcon className='w-5 h-5 text-gray-500' />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password Field */}
                <div>
                    <label htmlFor="confirmNewPassword" className='text-sm text-gray-500'>Confirm New Password</label>
                    <div className='relative'>
                        <input
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            placeholder='Enter Password'
                            className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BEE36E] pr-10'
                        />
                        <button
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                        >
                            {showConfirmNewPassword ? (
                                <EyeSlashIcon className='w-5 h-5 text-gray-500' />
                            ) : (
                                <EyeIcon className='w-5 h-5 text-gray-500' />
                            )}
                        </button>
                    </div>
                </div>

                <button className='bg-[#BEE36E] max-w-fit mx-auto text-sm text-black px-4 py-2 rounded-full'>
                    Change Password
                </button>
            </div>

            {/* Vertical Line */}
            <div className='hidden md:block w-[1px] bg-gray-200 self-stretch mx-4'></div>

            {/* Right Section - Two-Factor Authentication */}
            <div className='flex flex-col gap-4 flex-1'>
                <label htmlFor="twoFactorAuth" className='flex justify-between items-center cursor-pointer'>
                    <span className='text-sm text-gray-700'>Two-Factor Authentication</span>
                    <div className='relative'>
                        <input
                            type="checkbox"
                            id="twoFactorAuth"
                            className='sr-only peer' // Hidden checkbox
                        />
                        <div className='w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#BEE36E] peer-focus:ring-[#BEE36E] peer-focus:ring-2'></div>
                        <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5'></div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Security;