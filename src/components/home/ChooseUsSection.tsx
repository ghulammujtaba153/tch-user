import React from "react";

const ChooseUsSection: React.FC = () => {
  return (
    <div className="bg-[#F5F5F5] py-8 md:py-16 px-4 md:p-10">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14">
        {/* Image Section */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <div className="flex items-center justify-center lg:justify-end">
            <img 
              src="/chooseUs-1.png" 
              alt="chooseus-1" 
              className="w-full max-w-[350px] md:max-w-[480px] h-auto rounded-[20px]" 
            />
          </div>
          
          <img 
            src="/chooseUs-2.png" 
            alt="chooseus-2" 
            className="w-full max-w-[300px] md:max-w-[412px] h-auto mt-[-50px] md:mt-[-100px] rounded-[20px] border-[8px] md:border-[15px] border-white self-start md:self-auto" 
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col font-sans gap-4 w-full lg:w-1/2 px-4 md:px-0">
          <div className="w-full flex items-center gap-2">
            <img 
              src="/home-header.png" 
              alt="home-header" 
              className="w-[20px] h-[15px]" 
            />
            <p className="text-sm font-normal font-onest leading-[15px] text-[#000000] tracking-[3.5px]">
              WHY CHOOSE US
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-onest">
            Why we stand out together
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Driven by compassion and a shared vision, we work hand-in-hand with
            communities to create meaningful change.
          </p>

          <p className="text-sm md:text-base text-gray-500 leading-relaxed mt-2">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites.
          </p>
        
          {/* Button */}
          <button className='w-[150px] h-[45px] bg-secondary text-black flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-[#a8cc5c] transition-colors duration-300 mt-4'>
            About Us
            <img 
              src="/arrow-black.png" 
              alt="arrow-right" 
              className='w-[20px] h-[20px]' 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseUsSection;