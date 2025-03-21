import React, { useState, useEffect } from 'react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Regular Donor",
        image: "/testimonial.png",
        quote: "Making a difference through this platform has been incredibly rewarding. The transparency and ease of use make it my go-to for charitable giving.",
        rating: 4
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Campaign Organizer",
        image: "/testimonial.png",
        quote: "As someone who's organized multiple fundraising campaigns, I can't praise this platform enough. The support and tools provided are exceptional.",
        rating: 5
    },
    {
        id: 3,
        name: "Emma Williams",
        role: "Monthly Supporter",
        image: "/testimonial.png",
        quote: "I love how easy it is to track the impact of my donations. The regular updates from beneficiaries make the giving experience so much more meaningful.",
        rating: 4
    }
];

const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        let interval: number | NodeJS.Timeout;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying]);
    
    
    

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    
return (
    <div className="relative w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
                {/* Main Testimonial Card */}
                <div className="bg-white rounded-[20px] shadow-lg p-8 md:p-12 transition-all duration-500">
                    <div className="flex flex-col gap-6">
                        {/* Profile and Rating Section */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Avatar and Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 relative">
                                    <img
                                        src={testimonials[currentIndex].image}
                                        alt={testimonials[currentIndex].name}
                                        className="w-full h-full rounded-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{testimonials[currentIndex].name}</p>
                                    <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <img src="/star.png" alt="star" className="w-[15px] h-[15px]" />
                                ))}
                            </div>
                        </div>

                        <div className='w-full h-[1px] bg-gray-200'></div>

                        {/* Quote */}
                        <blockquote className="text-xl italic text-gray-800">
                            "{testimonials[currentIndex].quote}"
                        </blockquote>
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            role="button"
                            aria-label={`Go to testimonial ${index + 1}`}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentIndex ? 'bg-[#BEE36E]' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                
            </div>
        </div>
    </div>
);

// ... rest of the component remains the same ...
};

export default TestimonialCarousel;
