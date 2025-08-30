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
      <div className="w-full h-[50%] md:h-[760px] relative overflow-hidden">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          interval={5000}
          className="w-full h-full"
        >
          <div>
            <img
              src="/hero/1.png"
              alt="Slide 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="/hero/2.png"
              alt="Slide 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <img
              src="/hero/3.png"
              alt="Slide 3"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <img
              src="/hero/4.png"
              alt="Slide 4"
              className="w-full h-full object-cover"
            />
          </div>

          
              
        </Carousel>

        {/* ✅ Text overlay (Responsive and Centered) */}
        {/* <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-12 bg-black/30">
          <div className="text-white max-w-[90%] sm:max-w-[70%]">
            <p className="text-xl sm:text-3xl md:text-4xl font-bold mb-2">Make.</p>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-3xl sm:text-5xl md:text-7xl font-bold text-primary leading-tight">
                Change
              </p>
              <div className="flex flex-col text-white text-lg sm:text-xl md:text-2xl font-bold">
                <p>With</p>
                <p>Donations!</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Buttons */}
      <div className="absolute flex flex-col md:flex-row items-center justify-center px-2 md:px-6 py-2 md:py-4 gap-4 bottom-[-95px] md:bottom-[200px] lg:bottom-[-30px] bg-white left-1/2 md:right-[26%] md:left-auto transform -translate-x-1/2 md:translate-x-0 shadow-lg rounded-md w-[90%] md:w-auto">
        <Link
          to={"/home/campaigns"}
          className="bg-secondary flex items-center justify-center text-white px-2 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[30px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Find Campaigns
        </Link>

        <Link
          to={"/signup"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[30px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          Register
        </Link>

        <Link
          to={"/faqs"}
          className="bg-secondary flex items-center justify-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm sm:text-lg font-bold w-full sm:w-[210px] h-[30px] sm:h-[50px] shadow-md hover:scale-105 transition-all duration-300"
        >
          FAQs
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
