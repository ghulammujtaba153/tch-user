import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/userContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAppConfig } from '../../context/AppConfigContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext) || { user: null, logout: () => { } };
  const { config } = useAppConfig();
  const [isOpen, setIsOpen] = useState(false);






  return (
    <nav className="fixed top-0 left-0 px-4 right-0 bg-bg z-50 pt-2 font-sans">
      <div className="max-w-[1200px] mx-auto py-2 font-size-14 h-[57px] relative">
        <div className="flex justify-between items-center h-full">
          {/* Rest of the navbar content stays the same */}
          <div className='flex items-center gap-4'>
            <Link to="/">
              <img src={config?.logo} alt="logo" className="h-[70px] w-[200px]" />
            </Link>
            <img src={"/line.png"} alt="logo" className='w-[1px] h-[30px] hidden md:block' />

            <div className="hidden lg:flex items-center text-sm gap-4 xl:gap-6">


              <Link to="/" className="hover:text-secondary transition-colors duration-300">Home</Link>
              <Link to="/home/campaigns" className="hover:text-secondary transition-colors duration-300">Find Campaigns</Link>
              <Link to="/support" className="hover:text-secondary transition-colors duration-300">Contact Us</Link>

              <div className="relative">
                <p
                  className="cursor-pointer hover:text-secondary transition-colors duration-300"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  Need Help?
                </p>

                {isOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <Link
                      to="/faqs"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/guides"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Help Guides
                    </Link>
                    <Link
                      to="/support"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Support
                    </Link>
                  </div>
                )}
              </div>

              {/* <Link to="/home/campaigns/create" className="hover:text-secondary transition-colors duration-300">Start Campaign</Link> */}
              {/* <Link to="/works" className="hover:text-secondary transition-colors duration-300">How it works</Link> */}
              {/* <Link to="/about" className="hover:text-secondary transition-colors duration-300">About</Link> */}
              {/* <Link to="/faqs" className="hover:text-secondary transition-colors duration-300">FAQ's</Link>
              <Link to="/fees" className="hover:text-secondary transition-colors duration-300">Fees & Payouts</Link>
              
              <Link to="/blogs" className="hover:text-secondary transition-colors duration-300">Blogs</Link>
              <Link to="/guides" className="hover:text-secondary transition-colors duration-300">Guide</Link>
              <Link to="/home-sec" className="hover:text-secondary transition-colors duration-300">LS Home</Link> */}
            </div>
          </div>

          <div className='hidden lg:flex items-center gap-4'>
            {user ? <>

              {
                <Link to={user?.role === "admin" ? "/dashboard" : "/user/dashboard/overview"} className="bg-primary w-[120px] text-black px-4 py-2 rounded-full hover:scale-105 transition-trnaform duration-300">
                  Dashboard
                </Link>
              }
              <button onClick={logout} className="bg-secondary w-[120px]  text-white px-4 py-2 rounded-full hover:scale-105 transition-trnasform duration-300">
                Logout
              </button>
              <div className='flex items-center gap-2'>
                {user?.profilePicture ? <img src={user?.profilePicture} alt="avatar" className='w-[40px] h-[40px] rounded-full' /> : <UserCircleIcon className="w-10 h-10" />}
                {/* <p className='text-sm'>{user?.name}</p> */}
              </div>
            </> : <>
              <Link to="/signup" className="bg-primary text-sm flex items-center justify-center text-black px-4 py-2 rounded-full w-[100px] hover:scale-105 transition-transform duration-300">
                SIGN UP
              </Link>
              <Link to="/signin" className="bg-secondary text-sm flex items-center justify-center text-white px-4 py-2 rounded-full w-[100px] hover:scale-105 transition-transform duration-300">
                LOGIN
              </Link>
            </>
            }

          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black mb-1.5 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          absolute top-[57px] left-0 right-0 bg-bg shadow-lg rounded-b-lg
          transform transition-all duration-300 ease-in-out
          lg:hidden
          ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}>
          <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col text-sm gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary w-full transition-colors duration-300">Home</Link>
              <Link to="/home/campaigns" onClick={() => setIsMenuOpen(false)} className="hover:text-secondary w-full transition-colors duration-300">Find Campaigns</Link>
              <Link to="/support" className="hover:text-secondary transition-colors duration-300">Contact Us</Link>
              {/* <Link to="/home/campaigns/create" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary w-full transition-colors duration-300">Start Campaign</Link> */}
              {/* <Link to="/works" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary w-full transition-colors duration-300">How it works</Link> */}
              {/* <Link to="/about" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary w-full transition-colors duration-300">About</Link>
              <Link to="/faqs" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary w-full transition-colors duration-300">FAQ's</Link>
              <Link to="/fees" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary w-full transition-colors duration-300">Fees & Payouts</Link>
              <Link to="/support" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary w-full transition-colors duration-300">Support</Link>
              <Link to="/blogs" onClick={()=> setIsMenuOpen(false)}  className="hover:text-secondary transition-colors duration-300">Blogs</Link>
              <Link to="/guides" onClick={()=> setIsMenuOpen(false)} className="hover:text-secondary transition-colors duration-300">Guide</Link> */}
            </div>
            <div className='flex flex-col gap-3 pt-2'>

              {user && <div className='flex items-center gap-2'>
                {user?.profilePicture ? <img src={user?.profilePicture} alt="avatar" className='w-[40px] h-[40px] rounded-full' /> : <img src={"/user.png"} alt="avatar" className='w-[40px] h-[40px] rounded-full' />}
                <p className='text-sm'>{user?.name}</p>
              </div>}

              {user ? <>

                {
                  <Link to={user?.role === "admin" ? "/dashboard" : "/user/dashboard/overview"} onClick={() => setIsMenuOpen(false)} className="bg-secondary flex items-center justify-center text-sm text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                    Dashboard
                  </Link>
                }
                <button onClick={logout} className="bg-secondary text-sm text-white px-4 py-2 rounded-full hover:scale-105 trnasition-trnasform duration-300">
                  Logout
                </button>
              </>

                : <>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="bg-secondary text-sm text-white px-4 py-2 rounded-full hover:scale-105 trnasition-trnasform duration-300">
                    Signup
                  </Link>
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)} className="bg-secondary text-sm text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
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