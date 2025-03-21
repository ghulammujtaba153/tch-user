import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/userContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext) || { user: null, logout: () => {} };
  // console.log(user);

  

  return (
    <nav className="fixed top-0 left-0 px-4 right-0 bg-white z-50 pt-2 font-sans">
      <div className="max-w-[1200px] mx-auto py-2 font-size-14 h-[57px] relative">
        <div className="flex justify-between items-center h-full">
          {/* Rest of the navbar content stays the same */}
          <div className='flex items-center gap-4'>
            <Link to="/">
            <img src={"/nav-logo.png"} alt="logo" width={100} height={100} className=""/>
            </Link>
            <img src={"/line.png"} alt="logo" className='w-[1px] h-[30px] hidden md:block'/>
            
            {/* <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="hover:text-[#BEE36E] transition-colors duration-300">Home</Link>
              <Link to="/campaigns" className="hover:text-[#BEE36E] transition-colors duration-300">About Us</Link>
              <Link to="/donate" className="hover:text-[#BEE36E] transition-colors duration-300">Services</Link>
              <Link to="/about" className="hover:text-[#BEE36E] transition-colors duration-300">Blog</Link>
              <Link to="/contact" className="hover:text-[#BEE36E] transition-colors duration-300">Donate</Link>
              <Link to="/contact" className="hover:text-[#BEE36E] transition-colors duration-300">Contact Us</Link>
            </div> */}
          </div>

          <div className='hidden md:flex items-center gap-4'>
            {user ? <>
            
            {
              <Link to={user?.role === "admin" ? "/dashboard" : "/user/dashboard/overview"} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
              Dashboard
            </Link>
            }
            <button onClick={logout} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
              Logout
            </button>
            <div className='flex items-center gap-2'>
              {user?.profilePicture ? <img src={user?.profilePicture} alt="avatar" className='w-[40px] h-[40px] rounded-full'/> : <UserCircleIcon className="w-10 h-10" />}
              {/* <p className='text-sm'>{user?.name}</p> */}
            </div>
            </> : <>
            <Link to="/signup" className="bg-black flex items-center justify-center text-white px-4 py-2 rounded-full w-[100px] hover:bg-gray-800 transition-colors duration-300">
              Signup
            </Link>
            <Link to="/signin" className="bg-[#BEE36E] flex items-center justify-center text-black px-4 py-2 rounded-full w-[100px] hover:bg-[#a8cc5c] transition-colors duration-300">
              Login
            </Link>
            </>
            }

          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black mb-1.5 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          absolute top-[57px] left-0 right-0 bg-white shadow-lg rounded-b-lg
          transform transition-all duration-300 ease-in-out
          md:hidden
          ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}>
          <div className="flex flex-col p-4 gap-4">
              {/* <Link to="/" className="hover:text-[#BEE36E] transition-colors duration-300">Home</Link>
              <Link to="/campaigns" className="hover:text-[#BEE36E] transition-colors duration-300">About Us</Link>
              <Link to="/donate" className="hover:text-[#BEE36E] transition-colors duration-300">Services</Link>
              <Link to="/about" className="hover:text-[#BEE36E] transition-colors duration-300">Blog</Link>
              <Link to="/contact" className="hover:text-[#BEE36E] transition-colors duration-300">Donate</Link>
              <Link to="/contact" className="hover:text-[#BEE36E] transition-colors duration-300">Contact Us</Link>
             */}
            <div className='flex flex-col gap-3 pt-2'>

            {user && <div className='flex items-center gap-2'>
              {user?.profilePicture ? <img src={user?.profilePicture} alt="avatar" className='w-[40px] h-[40px] rounded-full'/> : <img src={"/user.png"} alt="avatar" className='w-[40px] h-[40px] rounded-full'/>}
              <p className='text-sm'>{user?.name}</p>
            </div>}
              
              {user ? <> 

                {
              <Link to={user?.role === "admin" ? "/dashboard" : "/user/dashboard/overview"} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
              Dashboard
            </Link>
            }
              <button onClick={logout} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
                Logout
              </button>
              </>
              
              : <>
              <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
                Signup
              </Link>
              <Link to="/signin" className="bg-[#BEE36E] text-black px-4 py-2 rounded-full hover:bg-[#a8cc5c] transition-colors duration-300">
                Login
              </Link>
              </>
              }

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;