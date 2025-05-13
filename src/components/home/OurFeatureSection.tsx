import React, { useEffect, useState } from "react";
import FeatureCard from "./feature/featureCard";
import { BASE_URL } from "../../config/url";
import axios from "axios";



const OurFeatureSection: React.FC = () => {
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/features`)
                console.log(res.data)
                setData(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }


    return <div className="max-w-[1200px] mx-auto py-16 px-4 flex flex-col items-center justify-center gap-14 p-10">

        {/* Text Section */}
        <div className="flex flex-col gap-4 ">
            <div className="w-full flex items-center justify-center gap-2">
                <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
                <p className="text-xs font-normal leading-[15px] text-[#000000] tracking-[3.5px]">{data?.subtitle}</p>
            </div>

            <h1 className="text-4xl text-center font-bold font-onest">{data?.title}</h1>

            <p className="text-xs text-gray-500 leading-relaxed font-sans">{data?.description}</p>

        </div>

        {/* cards section */}

        <div className="w-full flex flex-col items-center md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {data?.features.map((card, index) => (
                // reverse={index % 2 === 0 ? true : false}
                <FeatureCard key={index} {...card} reverse={false} />
            ))}


        </div>


    </div>;
};

export default OurFeatureSection;
