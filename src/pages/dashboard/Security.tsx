import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/userContext';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { useAppConfig } from '../../context/AppConfigContext';

const Security = () => {
    // State to manage password visibility for each field
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Security | ${config.name}`;
    }
  }, [config]);

    // State to manage password values
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext)!;

    const handleSubmit = async () => {
        // Validate that new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            toast.error('New password and confirm new password do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
                id: user?.userId,
                oldPassword, // Include old password for verification
                newPassword,
                confirmPassword: confirmNewPassword,
            });

            if (res.data) {
                toast.success('Password changed successfully!');
                // Clear the form fields
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col md:flex-row justify-between gap-8 md:gap-4 p-4'>
            {/* Left Section - Change Password */}
            <div className='flex flex-col gap-4 flex-1'>
                <h1 className='text-2xl font-bold text-secondary'>Change Password</h1>

                {/* Old Password Field */}
                <div>
                    <label htmlFor="oldPassword" className='text-sm text-gray-500'>Old Password</label>
                    <div className='relative'>
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder='Enter Old Password'
                            className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary pr-10'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
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
                            placeholder='Enter New Password'
                            className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary pr-10'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                            placeholder='Confirm New Password'
                            className='w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary pr-10'
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
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

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='bg-secondary max-w-fit mx-auto text-sm text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? 'Changing Password...' : 'Change Password'}
                </button>
            </div>

            {/* Vertical Line */}
            <div className='hidden md:block w-[1px] bg-gray-200 self-stretch mx-4'></div>

            {/* Right Section - Two-Factor Authentication */}
            <div className='flex flex-col gap-4 flex-1'>
                {/* <label htmlFor="twoFactorAuth" className='flex justify-between items-center cursor-pointer'>
                    <span className='text-sm text-gray-700'>Two-Factor Authentication</span>
                    <div className='relative'>
                        <input
                            type="checkbox"
                            id="twoFactorAuth"
                            className='sr-only peer' // Hidden checkbox
                        />
                        <div className='w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-secondary peer-focus:ring-secondary peer-focus:ring-2'></div>
                        <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5'></div>
                    </div>
                </label> */}
            </div>
        </div>
    );
};

export default Security;