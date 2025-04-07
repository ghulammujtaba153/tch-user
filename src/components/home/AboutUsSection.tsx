import React from "react";

const AboutUsSection: React.FC = () => {
  return (
    <section className="w-full py-16 text-black bg-[#F8F8F8]">
        <div className="max-w-[1200px] mx-auto p-4 flex gap-4 justify-between">
            {/* Image Section */}
      <div className="flex flex-col flex-1 hidden md:flex">
        <img src="/aboutus-1.png" alt="aboutus" className="w-[555px] h-[555px] rounded-full"/>
        <div className="flex justify-end -mt-40">
          <img src="/aboutus-2.png" alt="aboutus" className="w-[265px] h-[265px] rounded-full border-2 border-white"/>
        </div>
      </div>

      {/* Text Section */}
      <div className="flex-1 font-sans flex flex-col gap-10">
        {/* Header Section */}
        <div className="w-full flex items-center gap-2">
            <img 
              src="/home-header.png" 
              alt="home-header" 
              className="w-[20px] h-[15px]" 
            />
            <p className="text-sm font-normal font-onest leading-[15px] text-[#000000] tracking-[3.5px]">
              ABOUT US
            </p>
          </div>

        {/* Title Section */}
        <h1 className="text-4xl font-bold font-onest">United in compassion, changing lives</h1>

        <p className="text-sm text-gray-500">Our dedication, transparency, and community-driven approach set us apart.
        partnering with us,programs that create meaningful change.</p>

        {/* List Section */}
        
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <img src="/check-mark.png" alt="aboutus" className="w-[15px] h-[15px]"/>
                    <p className="text-sm">community-centered approach</p>
                </div>
                <div className="flex items-center gap-2">
                    <img src="/check-mark.png" alt="aboutus" className="w-[15px] h-[15px]"/>
                    <p className="text-sm">transparency and accountability</p>
                </div>
                
                
            </div>

            <div className="flex flex-col gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                

                    <img src="/check-mark.png" alt="aboutus" className="w-[15px] h-[15px]"/>
                    <p className="text-sm">empowerment through partner</p>
                </div>
                <div className="flex items-center gap-2">
                    <img src="/check-mark.png" alt="aboutus" className="w-[15px] h-[15px]"/>
                    <p className="text-sm">volunteer and donor engagement</p>
                </div>
            </div>
        </div>

        {/* Numbers Section */}

        <div className='flex flex-col md:flex-row items-center justify-between p-4 gap-2'>
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-4xl font-bold text-secondary">25+</h1>
                    <p className="text-sm">Years of experience</p>
                </div>

                <div className="h-full w-[1px] bg-gray-300"></div>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-4xl font-bold text-secondary">25+</h1>
                    <p className="text-sm">Years of experience</p>
                </div>
                <div className="h-full w-[1px] bg-gray-300"></div>

                <div className="flex flex-col items-center gap-2 ">
                    <h1 className="text-4xl font-bold text-secondary">25+</h1>
                    <p className="text-sm">Years of experience</p>
                </div>
                
            </div>
        
      </div>
        </div>
        
    </section>
  );
};

export default AboutUsSection;
