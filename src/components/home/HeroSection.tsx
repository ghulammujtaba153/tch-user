import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utils/ScrollToTop";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeroSection: React.FC = () => {
  return (
    <div className="w-full mx-auto pb-4 max-h-[800px] flex flex-col md:flex-row justify-between items-center mt-[67px] font-onest relative">
      <ScrollToTop />

      {/* Hero Carousel */}
      <div className="w-full h-[300px] md:h-[560px] relative overflow-hidden ">
        {/* <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          interval={5000}
          className="w-full h-full"
        >
          <div>
            <img
              src="/hero-img.png"
              alt="Slide 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="/hero-img.png"
              alt="Slide 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="/hero-img.png"
              alt="Slide 3"
              className="w-full h-full object-cover"
            />
          </div>
        </Carousel> */}

        <img src="/hero-img1.jpg" alt="/" className="w-full h-full object-cover" />


        {/* Text overlay */}
        {/* <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 w-[90%] flex flex-col justify-end">
          <div className="flex flex-col gap-2 text-white mb-4 w-full">
            <div className="flex text-white w-full">
              <p className="text-2xl md:text-4xl font-bold">Make.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between text-white mb-4 w-full">
              <div className="flex items-center">
                <p className="text-4xl md:text-7xl font-bold text-primary tracking-wide leading-tight">
                  Change
                </p>
                <div className="flex flex-col text-white text-normal md:text-2xl font-bold ml-2">
                  <p>With</p>
                  <p>Donations!</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Buttons */}
      <div className="absolute flex flex-col md:flex-row items-center px-6 py-4 gap-4 bottom-[-10px] bg-white right-[5%] md:right-[26%] shadow-lg rounded-md">
        <Link
          to={"/home/campaigns"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[40px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Find Campaigns <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>

        <Link
          to={"/signup"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[40px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Register <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>

        <Link
          to={"/user/dashboard/profile"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[40px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Register Organization
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
