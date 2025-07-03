import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../../utils/ScrollToTop";

const HeroSection: React.FC = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto p-4 max-h-[800px] flex flex-col md:flex-row justify-between items-center mt-[77px] font-onest relative">
      <ScrollToTop />

      {/* Hero Image */}
      <div className="w-full h-[300px] md:h-[560px] relative rounded-[60px] overflow-hidden">
        <img
          src={"/hero-img.png"}
          alt="hero-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full rounded-lg">
          <img
            src={"/hero-upper.png"}
            alt="hero-image"
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 w-[90%] flex flex-col justify-end">
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
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute flex flex-col md:flex-row items-center px-6 py-4 gap-4 bottom-[-5px] bg-white right-[5%] md:right-[25%] shadow-lg rounded-md">
        <Link
          to={"/home/campaigns"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[40px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Find Campaigns <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>

        <Link
          to={"/signin"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[40px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Register <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>

        <Link
          to={"/user/dashboard/overview"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[40px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Create Organization
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
