import axios from 'axios';
import { useContext, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/userContext';
import Notification from '../components/notification/Notification';


const AdminSignIn = () => {
    const [hide, setHide] = useState(true);
   
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext) || { login: () => {} };
    const [user, setUser]= useState({
      userId: "",
      email: "",
      name: "",
      role: "",
      isAdmin: false,
      profilePicture: ""
    });

    const handleChange = (e : any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const res = await axios.post(`${BASE_URL}/auth/login`, data);
                console.log(res.data);
                if (res.data.user.role !== "admin") {
                    toast.error("only admin can login from this page");
                    setError("only admin can login from this page");
                    return 
                }


                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                const user = {
                  userId: res.data.user._id,
                  email: res.data.user.email,
                  name: res.data.user.name,
                  role: res.data.user.role,
                  isAdmin: res.data.user.isAdmin,
                  profilePicture: res.data.user.profilePicture
                }
                login(user, res.data.token);
                setUser(user);
                // navigate('/home/campaigns');
                toast.success(res.data.message);
                setSuccess(res.data.message);
            } catch (error: any) {
                toast.error(error.response.data.message);
                setError(error.response.data.message);
            }
        });
    };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {success && <Notification isOpen={true} title="Success" message="login successfully" type="success" onClose={() => setSuccess('')} link={`${user?.role === "admin" ? "/dashboard" : user?.role === "donor" ? "/home/campaigns" : "/user/dashboard/overview"}`}/>}
      {error && <Notification isOpen={true} title="Error" message={error} type="error" onClose={() => setError('')} />}
      <div className="w-full max-w-md space-y-8 bg-white px-8 py-12 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/nav-logo.png" alt="logo" className='w-[150px] h-[40px]'/>
        </div>

        

        <form className="mt-8 space-y-6 font-sans">
          <div className="space-y-4">
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
              <div className='flex items-center justify-between'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgetpassword" className="font-medium text-[#BEE36E] hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>

              </div>
              
              <div className='relative'>
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
                        className='absolute right-3 top-3 w-6 h-6 cursor-pointer' 
                      />
                </div>

            </div>

            
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isPending}
            >
              Login
            </button>
          </div>          

        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;


