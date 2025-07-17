import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../../config/url";


type AboutUsData = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { value: string; label: string }[];
  images: { mainImage: string; secondaryImage: string };
}



const AboutUsSection: React.FC = () => {
  const [aboutData, setAboutData] = React.useState<AboutUsData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false)

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/about-us`)
        if (res.data) {
          setAboutData(res.data)
        }
        console.log(res.data)
      } catch (error) {
        console.error("Failed to fetch about us data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAboutData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }


  return (
    <section className="w-full py-16 text-black bg-bg">
      <div className="max-w-[1200px] mx-auto p-4 flex gap-4 justify-between">
        {/* Image Section */}
        <div className="flex flex-col flex-1 hidden md:flex">
          <img src={aboutData?.images?.mainImage} alt="aboutus" className="w-[555px] h-[555px] rounded-full object-cover" />
          <div className="flex justify-end -mt-40">
            <img src={aboutData?.images?.secondaryImage} alt="aboutus" className="w-[265px] h-[265px] rounded-full border-2 border-white object-cover" />
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 font-sans flex flex-col gap-10 ">
          {/* Header Section */}
          <div className="w-full flex items-center gap-2">
            <img
              src="/home-header.png"
              alt="home-header"
              className="w-[20px] h-[15px]"
            />
            <p className="text-sm font-normal font-onest leading-[15px] text-[#000000] tracking-[3.5px]">
              {aboutData?.subtitle}
            </p>
          </div>

          {/* Title Section */}
          <h1 className="text-4xl font-bold font-onest">{aboutData?.title}</h1>

          <p className="text-sm text-gray-500">{aboutData?.description}</p>

          {/* List Section */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {
              aboutData?.features?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img src="/check-mark.png" alt="aboutus" className="w-[15px] h-[15px]" />
                  <p className="text-sm">{item}</p>
                </div>
              ))
            }
          </div>



          {/* Numbers Section */}

          {/* <div className='flex flex-col md:flex-row items-center justify-between p-4 gap-2'>
            {
              aboutData?.stats?.map((stat) =>
                <div className="flex flex-col items-center gap-2">
                  <h1 className="text-4xl font-bold text-secondary">{stat?.value}</h1>
                  <p className="text-sm">{stat?.label}</p>
                </div>
              )
            }


          </div> */}

        </div>
      </div>

    </section>
  );
};

export default AboutUsSection;
