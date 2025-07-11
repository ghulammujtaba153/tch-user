import { ArrowRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/url";
import { Link } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import { useAppConfig } from "../context/AppConfigContext";

const FeesPayouts: React.FC = () => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Fees | ${config.name}`;
    }
  }, [config]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/payouts`);
        if (res.data) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" pt-[160px] px-4">
      <ScrollToTop />
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14">
        {/* Image Section */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <div className="flex items-center justify-center lg:justify-end">
            {!mainLoaded && (
              <div className="w-full max-w-[350px] md:max-w-[480px] h-[200px] bg-gray-200 animate-pulse rounded-[20px]"></div>
            )}
            <img
              src={data?.images?.mainImage}
              alt="chooseus-1"
              className={`w-full max-w-[350px] md:max-w-[480px] h-auto rounded-[20px] transition-opacity duration-300 ${
                mainLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
              onLoad={() => setMainLoaded(true)}
            />
          </div>

          <div className="relative self-start md:self-auto">
            {!secondaryLoaded && (
              <div className="w-full max-w-[300px] md:max-w-[412px] h-[180px] bg-gray-200 animate-pulse rounded-[20px] border-[8px] md:border-[15px] border-white"></div>
            )}
            <img
              src={data?.images?.secondaryImage}
              alt="chooseus-2"
              className={`w-full max-w-[300px] md:max-w-[412px] h-auto mt-[-50px] md:mt-[-100px] rounded-[20px] border-[8px] md:border-[15px] border-white transition-opacity duration-300 ${
                secondaryLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
              onLoad={() => setSecondaryLoaded(true)}
            />
          </div>
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
              {data?.subtitle}
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-onest">
            {data?.title}
          </h1>

          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            {data?.shortDescription}
          </p>

          <p className="text-sm md:text-base text-gray-500 leading-relaxed mt-2">
            {data?.longDescription}
          </p>

          {/* Button */}
          <Link
            to={"/home/campaigns"}
            className="w-[150px] h-[45px] bg-secondary text-white flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 mt-4"
          >
            {data?.buttonText}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeesPayouts;
