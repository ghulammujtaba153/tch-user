import React from 'react';

interface FeatureCardProps {
    image: string;
    stats: string;
    title: string;
    description: string;
    image2: string;
    reverse: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ image, stats, title, description, image2, reverse }) => {
    return (
        <div className="font-sans max-w-[350px] flex flex-col bg-white rounded-lg p-4 gap-6 hover:shadow-lg transition-shadow duration-300">
            
            {
                !reverse && <img src={image} alt="our-feature-1" className="max-h-[380px] max-w-[350px] rounded-lg" />
            }

            
            <div className="flex flex-wrap items-center gap-4 p-4">
                {/* Text Section */}
                <div className="flex-1 flex flex-col space-y-1">
                    <h1 className="text-3xl font-bold text-[#BEE36E] mb-4">{stats}</h1>
                    <p className="font-onest text-sm font-bold">{title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Image Section */}
                <div className="flex h-full">
                    <img
                    src={image2}
                    alt="campaign-card-image"
                    className="w-[50px] h-[50px]"
                    />
                </div>
            </div>

            {
                reverse && <img src={image} alt="our-feature-1" className="max-h-[330px] max-w-[350px] rounded-lg" />
            }
        </div>
    )
}

export default FeatureCard;

