import React, { useState, useTransition } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import { toast } from 'react-toastify';
import Notification from '../components/notification/Notification';

const NewPassword = () => {
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    console.log(data);
    startTransition(async () => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
          id,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });
        console.log(res.data);
        toast.success(res.data.message);
        setSuccess(res.data.message);
        // navigate('/signin');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to reset password.');
        setError(error.response?.data?.message || 'Failed to reset password.');
        console.log(error);
      } finally {
        // setIsPending(false);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15 px-4 sm:px-6 lg:px-8 font-sans">
      {success && (
        <Notification
          isOpen={true}
          title="Success"
          message="Password reset successfully"
          type="success"
          onClose={() => setSuccess('')}
          link="/signin"
        />
      )}
      {error && (
        <Notification
          isOpen={true}
          title="Error"
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center">
          <img src="/nav-logo.png" alt="logo" className="w-[200px] h-[50px]" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900">New Password</h1>
          <p className="text-gray-700 text-sm">Create a new password</p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type={hide ? 'password' : 'text'}
                required
                value={data.newPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="••••••••"
              />
              <img
                src={hide ? '/hide.png' : '/view.png'}
                onClick={() => setHide(!hide)}
                alt="eye-icon"
                className="absolute right-3 top-8 w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={hideConfirm ? 'password' : 'text'}
                required
                value={data.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="••••••••"
              />
              <img
                src={hideConfirm ? '/hide.png' : '/view.png'}
                onClick={() => setHideConfirm(!hideConfirm)}
                alt="eye-icon"
                className="absolute right-3 top-8 w-6 h-6 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <button
              disabled={isPending}
              onClick={handleSubmit}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating Password...' : 'Create Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;