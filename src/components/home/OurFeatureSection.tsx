import React from "react";
import FeatureCard from "./feature/featureCard";

const OurFeatureSection: React.FC = () => {

    const featureCards = [
        {   
            image: "/campaign-card.png",
            stats: "96%",
            title: "Healthcare Support",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            image2: "/hand-heart.png",
            reverse: false
        },
        {
            image: "/campaign-card.png",
            stats: "94%",
            title: "Education Support",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            image2: "/money.png",
            reverse: true
        },
        {
            image: "/campaign-card.png",
            stats: "95%",
            title: "Food Support",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            image2: "/bag.png",
            reverse: false
        }

    ]
  return <div className="max-w-[1200px] mx-auto py-16 px-4 flex flex-col items-center justify-center gap-14 p-10">

    {/* Text Section */}
    <div className="flex flex-col gap-4 ">
        <div className="w-full flex items-center justify-center gap-2">
            <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
            <p className="text-xs font-normal leading-[15px] text-[#000000] tracking-[3.5px]">OUR FEATURES</p>
        </div>

        <h1 className="text-4xl text-center font-bold font-onest">Highlights our impactful work</h1>

        <p className="text-xs text-gray-500 leading-relaxed font-sans">Discover the positive change we've created through our programs, partnerships, and dedicated
        efforts. From healthcare and education to environmental sustainability.</p>
        
    </div>

    {/* cards section */}

    <div className="w-full flex flex-col items-center md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* card 1 */}
        {featureCards.map((card, index) => (
            <FeatureCard key={index} {...card} />
        ))}
        
    </div>
    

  </div>;
};

export default OurFeatureSection;
