import React, { useEffect, useState } from "react";
import TestimonialCarousel from "./testimonial/TestimonialCarousel";
import axios from "axios";
import { BASE_URL } from "../../config/url";

const Testimonials: React.FC = () => {
    const [data, setData] =useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetch = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/testimonial`);
                setData(res.data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetch();
    },[])

    if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )
      }


    return (
        <div className="font-sans bg-primary w-full py-8 md:py-16">
            <div className="max-w-[1200px] mx-auto p-4 flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* image section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                    <img 
                        src={data?.image}
                        alt="testimonials"  
                        className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto rounded-[20px]" 
                    />
                </div>

                {/* text section */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img 
                            src="/home-header.png"
                            alt="home-header" 
                            className="w-[20px] h-[15px]" 
                        />
                        <p className="text-sm font-bold font-onest tracking-[3.5px]">{data?.subtitle}</p>   
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-onest">
                        {data?.title}
                    </h2>

                    <div className="mt-4 md:mt-8">
                    <TestimonialCarousel testimonials={data?.testimonials || []} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;