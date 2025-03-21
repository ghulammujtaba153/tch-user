import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-4 flex flex-col gap-8 mb-4 font-sans">

<div className="flex flex-col md:flex-row items-center justify-between bg-[#BEE36E] max-h-[300px] rounded-xl overflow-hidden">
    {/* Left Section */}
    <div className="w-full md:w-1/2 h-full flex justify-center md:justify-start">
        <img 
            src="/footer-img.jpg" 
            alt="logo" 
            className="w-full md:block hidden md:w-[90%] max-h-[300px] rounded-r-full object-cover"
        />
    </div>

    {/* Right Section */}
    <div className="flex flex-col gap-3 w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0">
        <h1 className="text-xl md:text-4xl font-bold text-white font-onest">
            Empower Change with every Donation!
        </h1>
        <p className="text-sm md:text-xs text-white">
            Join us in creating brighter futures by providing hope, delivering help, 
            and fostering lasting change for communities in need around the world.
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-start">
            <Link to={"/home/campaigns/create"} className="text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white">
                START CAMPAIGN 
                <img src="/arrow-1.png" alt="arrow" className="w-[20px] h-[20px]" />
            </Link>
            <Link to={"/home/campaigns"} className="bg-white font-bold text-black px-4 py-2 rounded-full flex items-center gap-2">
                Donate Now 
                <img src="/arrow-black.png" alt="arrow" className="w-[20px] h-[20px]" />
            </Link>
        </div>
    </div>
</div>



        <div className='w-full flex flex-col md:flex-row items-start justify-between gap-8'>
        <div className='flex flex-col justify-between gap-4 w-full md:w-1/3 h-full'>
            <div>
                <div className='flex mb-8'>
                    <img src="/footer-logo.png" alt="logo" className='w-[100px] h-[20px]'/>
                </div>

                <div className='flex flex-col md:justify-between md:flex-row gap-4 md:gap-8 mb-8'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Toll free Customer care</p>
                        <p className='text-sm font-bold font-onest'>1213 14 1441 1</p>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Need live support!</p>
                        <p className='text-sm font-bold font-onest'>info@tch.com</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <p className='text-sm font-bold mb-4'>Follow on</p>
                <div className="flex items-center gap-2">
                    {/* Social Media Links */}
                    <a
                        href="https://www.pinterest.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#a8cc5c] transition-all duration-300"
                        aria-label="Pinterest"
                    >
                        <img src="/pinterest.png" alt="Pinterest" className="w-[20px] h-[20px]" />
                    </a>

                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#a8cc5c] transition-all duration-300"
                        aria-label="Facebook"
                    >
                        <img src="/facebook.png" alt="Facebook" className="w-[20px] h-[20px]" />
                    </a>

                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#a8cc5c] transition-all duration-300"
                        aria-label="Instagram"
                    >
                        <img src="/instagram.png" alt="Instagram" className="w-[20px] h-[20px]" />
                    </a>
                </div>
            </div>
        </div>

        {/* Divider - visible only on desktop */}
        <div className="hidden md:block w-[1px] max-h-[200px] bg-[#E5E5E5] self-stretch"></div>


        {/* Right Section */}
        <div className='flex flex-col gap-6 w-full md:w-2/3'>
            <div className='flex items-center justify-between gap-4'>
                <input 
                    type="text" 
                    placeholder='Enter your email' 
                    className='w-full h-[40px] border border-[#BEE36E] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BEE36E]' 
                />
                <button className='w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#a8cc5c] transition-all duration-300'>
                    <img src="/send.png" alt="send" className='w-[20px] h-[20px]' />
                </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-sm font-bold mb-2 font-onest'>Quick Links</h2>
                    <a href="/" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Home</a>
                    <a href="/about" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>About Us</a>
                    <a href="/services" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Services</a>
                    <a href="/blog" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Blog</a>
                </div>

                <div className='flex flex-col gap-2'>
                    <h2 className='text-sm font-bold mb-2 font-onest'>Services</h2>
                    <a href="/food-security" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Food Security Initiative</a>
                    <a href="/healthcare" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Healthcare Access</a>
                    <a href="/education" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Education</a>
                    <a href="/women-empowerment" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Women Empowerment</a>
                </div>

                <div className='flex flex-col gap-2'>
                    <h2 className='text-sm font-bold mb-2 font-onest'>Support</h2>
                    <a href="/faq" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>FAQ</a>
                    <a href="/support" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Support</a>
                    <a href="/terms" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Terms & Conditions</a>
                    <a href="/privacy" className='text-sm hover:text-[#BEE36E] transition-colors duration-300'>Privacy Policy</a>
                </div>
            </div>
        </div>

        </div>

        
          
        
    </div>
  );
};

export default Footer;