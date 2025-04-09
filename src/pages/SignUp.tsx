import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import Notification from '../components/notification/Notification';
import GoogleLoginButton from '../components/home/GoogleButton';
import MicrosoftLoginButton from '../components/home/MicrosoftButton';



const SignUp = () => {
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(data);
  
    // Set loading state
    setIsPending(true);
  
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
      // Send OTP to the backend
      const res = await axios.post(`${BASE_URL}/auth/send-otp`, {
        email: data.email,
        otp,
      });
  
      if (res.data) {
        // Navigate to the email verification page with OTP and user data
        navigate('/email/verification', { state: { otp: res.data.otp, userData: data } });
        toast.success('OTP sent successfully to your email.');
      }
    } catch (error: any) {
      // Handle errors
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      // Reset loading state
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen my-[80px] px-4 sm:px-6 lg:px-8">
      {success && <Notification isOpen={true} title="Success" message="login successfully" type="success" onClose={() => setSuccess('')} link="/signin"/>}
      {error && <Notification isOpen={true} title="Error" message={error} type="error" onClose={() => setError('')} />}
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/nav-logo.png" alt="logo" className='w-[150px] h-[50px]'/>
          
        </div>
        
        <form className="mt-8 space-y-6 font-sans">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={data.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={data.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>


            <div className='relative'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
                  <input
                      id="password"
                      name="password"
                      type={hide ? "password" : "text"}
                      required
                      value={data.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-10"
                      placeholder="••••••••"
                      />
                      <img 
                        src={hide ? "/hide.png" : "/view.png"} 
                        onClick={() => setHide(!hide)} 
                        alt="eye-icon" 
                        className='absolute right-3 top-8 w-6 h-6 cursor-pointer' 
                      />
                </div>

            <div className='relative'>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={hideConfirm ? "password" : "text"}
                  required
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="••••••••"
              />
              <img 
                src={hideConfirm ? "/hide.png" : "/view.png"} 
                onClick={() => setHideConfirm(!hideConfirm)} 
                alt="eye-icon" 
                className='absolute right-3 top-8 w-6 h-6 cursor-pointer' 
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:scale-105 transition-transform duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </div>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-secondary hover:text-gray-900">
              Login
            </Link>
          </p>

          <div className="flex items-center justify-center space-x-4">
          <GoogleLoginButton/>
            
          </div>

          <div className="flex items-center justify-center space-x-4">
          
          <MicrosoftLoginButton/>
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default SignUp;