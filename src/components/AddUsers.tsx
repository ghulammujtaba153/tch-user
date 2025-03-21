import { useEffect, useState, useTransition } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import Notification from '../components/notification/Notification';




const AddUsers = () => {
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');


  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const res = await axios.get(`${BASE_URL}/auth/profile?id=${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log(res.data);
          setData({
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
            password: '',
            confirmPassword: '',
          });
        } catch (error: any) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUser();
  }, [id]);


  const handleUpdate = async () => {
    startTransition(async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/update-profile/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(res.data);
      toast.success(res.data.message);
      setSuccess(res.data.message);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response.data.message);
      setUpdateError(error.response.data.message || error.message || 'An error occurred');
    } })
  }

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(data);
    startTransition(async () => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/add-user-by-admin`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(res.data);
        // navigate('/signin');
        toast.success(res.data.message);
        setSuccess(res.data.message);
      } catch (error: any) {
        toast.error(error.response.data.message);
        console.log(error);
        setError(error.response.data.message || error.message || 'An error occurred');
      }
    });

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen my-15 px-4 sm:px-6 lg:px-8">
      {success && <Notification isOpen={true} title="Success" message="User added successfully!" type="success" onClose={() => setSuccess('')} link={'/users'}/>}
      {error && <Notification isOpen={true} title="Error" message={error} type="error" onClose={() => setError('')} />}

        {/* for update user */}
        {updateSuccess && <Notification isOpen={true} title="Success" message={updateSuccess} type="success" onClose={() => setUpdateSuccess('')} link={'/users'}/>}
        {updateError && <Notification isOpen={true} title="Error" message={updateError} type="error" onClose={() => setUpdateError('')} />}
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/footer-logo.png" alt="logo" className='w-[200px] h-[40px]'/>
          
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
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
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
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                </label>
                <select
                    id="role"
                    name="role"
                    required
                    value={data.role}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                >
                    <option value="admin">Admin</option>
                    <option value="campaign creator">Campaigner</option>
                    <option value="donor">Donor</option>
                </select>
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
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent pr-10"
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
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
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

          {!id ? <div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c]"
            >
              Register
            </button>
          </div> : <div>
            <button
              type="submit"
              onClick={handleUpdate}
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c]"
            >
              Update
            </button>
          </div>}
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          
        </form>
      </div>
    </div>
  );
};

export default AddUsers;