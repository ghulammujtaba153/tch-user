import React, { useEffect, useState } from "react";
import ScrollToTop from "../utils/ScrollToTop";
import { BASE_URL } from "../config/url";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useAppConfig } from "../context/AppConfigContext";

interface DynamicPageData {
  _id: string;
  heading: string;
  type: string;
  content: string;
  updatedAt: string;
}

const PrivacyPolicy = () => {
  const [data, setData] = useState<DynamicPageData | null>(null);
    const [loading, setLoading] = useState(false);
    const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Privacy | ${config.name}`;
    }
  }, [config]);

  const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/dynamic-page?type=privacy`);
        setData(res.data[0]); 
      } catch (error) {
        console.log("error",error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetch();
    }, []);
  
    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;


  return (
    <div className="pt-20 min-h-screen max-w-[1200px] mx-auto px-4 pb-10">
      <ScrollToTop />


      <h1 className="text-3xl font-bold text-center mb-10 text-secondary my-8">{data?.heading}</h1>

      
      {/* Render HTML content */}
      {/* <div
        className="prose prose-lg max-w-full"
        dangerouslySetInnerHTML={{ __html: data?.content || '' }}
      /> */}

<article
  className="prose prose-lg max-w-full"
  dangerouslySetInnerHTML={{ __html: data?.content || '' }}
/>
      
    </div>
  );
};

export default PrivacyPolicy;
