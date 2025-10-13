import axios from 'axios';
import { useContext, useEffect, useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/userContext';
import Notification from '../components/notification/Notification';
import GoogleLoginButton from '../components/home/GoogleButton';
import MicrosoftLoginButton from '../components/home/MicrosoftButton';
import { useAppConfig } from '../context/AppConfigContext';
import ReactGA from 'react-ga4';
import ScrollToTop from '../utils/ScrollToTop';

const SignIn = () => {
    const [hide, setHide] = useState(true);
    // const navigate = useNavigate();
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
      profilePicture: "",
      organization: null
    });
    const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Signin | ${config.name}`;
    }
  }, [config]);

    const handleChange = (e : any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

  

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const res = await axios.post(`${BASE_URL}/auth/login`, data);
                console.log(res.data);
                if(res.data.user.role === "admin") {
                  toast.error("Admin can't login from this page");
                  return
                }
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                const user = {
                  userId: res.data.user._id,
                  email: res.data.user.email,
                  name: res.data.user.name,
                  role: res.data.user.role,
                  profilePicture: res.data.user.profilePicture,
                  organization: res.data.user.organization,
                  phoneNumber: res.data.user.phoneNumber || null,
                  addressLine1: res.data.user.addressLine1 || null,
                  addressLine2: res.data.user.addressLine2 || null,
                  city: res.data.user.city || null,
                  state: res.data.user.state || null,
                  country: res.data.user.country || null,
                  postalCode: res.data.user.postalCode || null,
                  idNumber: res.data.user.idNumber || null,
                  taxNumber: res.data.user.taxNumber || null,
                  passportNumber: res.data.user.passportNumber || null,
                  isGoogleUse: res.data.user.isGoogleUse,
                  isMicrosoftUse: res.data.user.isMicrosoftUse,
                  gender: res.data.user.gender,
                  dateOfBirth: res.data.user.dateOfBirth,
                  nationality: res.data.user.nationality,
                  
                }
                login(user, res.data.token);
                setUser(user);

                ReactGA.event({
                  category: 'User',
                  action: 'Login',
                  label: 'Login Form Submission',
                })
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
    <div className="flex flex-col items-center justify-center min-h-screen my-[80px] px-4 sm:px-6 lg:px-8">
      <ScrollToTop />

      {success && <Notification isOpen={true} title="Success" message="login successfully" type="success" onClose={() => setSuccess('')} link={`${user?.role === "admin" ? "/dashboard" : user?.role === "donor" ? "/home/campaigns" : "/user/dashboard/overview"}`}/>}
      {error && <Notification isOpen={true} title="Error" message={error} type="error" onClose={() => setError('')} />}
      <div className="w-full max-w-md space-y-8 bg-white px-8 py-12 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src={config?.logo} alt="logo" className='h-[70px] w-[190px]'/>
        </div>


        <h1 className="font-bold text-center text-2xl">LOGIN</h1>
        

        

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
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <div className='flex items-center justify-between'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgetpassword" className="font-medium text-secondary hover:text-gray-900">
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
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-10"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:scale-105 transition-transform duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isPending}
            >
              Login
            </button>
          </div>

          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-secondary hover:scale-105 transition-transform duration-300">
              Register
            </Link>
          </p>

          <div className="flex items-center justify-center space-x-4">
          <GoogleLoginButton/>
            
          </div>

          <div className="flex items-center justify-center space-x-4">
          
          <MicrosoftLoginButton/>
          </div>

          <p className="mt-6 text-sm text-center">Version 1.2.0</p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;


