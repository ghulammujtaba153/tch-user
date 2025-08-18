import React, { useEffect, useState } from 'react'
import OurFeatureSection from '../components/home/OurFeatureSection'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'
import { useAppConfig } from '../context/AppConfigContext'
import Loading from '../components/Loading'
import axios from 'axios'
import { BASE_URL } from '../config/url'
import { Link } from 'react-router-dom'

const HowWorks = () => {
  const { config } = useAppConfig();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);


  useEffect(() => {
    if (config?.name) {
      document.title = `HowWork | ${config.name}`;
    }
  }, [config]);


  const fetchData = async()=>{
    try {
      const res = await axios.get(`${BASE_URL}/work-section`)
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }


  useEffect(()=>{
    fetchData();
  },[])


  if(loading) return <Loading/>

  return (
    <div className='pt-20'>
      <ScrollToTop />
      <div className='container mx-auto'>
        <div className='flex flex-col gap-4 mb-10'>
          <h1 className='text-2xl font-bold'>{data?.title}</h1>
          
<article
  className="prose prose-lg max-w-full"
  dangerouslySetInnerHTML={{ __html: data?.content || '' }}
/>
        </div>
        <div className='flex gap-4'> 
          <Link to="/signup" className='bg-primarylight text-white px-4 py-2 rounded-md'>Signup</Link>
          <Link to="/signin" className='bg-primarylight text-white px-4 py-2 rounded-md'>Login</Link>
        </div>

      </div>

    </div>
  )
}

export default HowWorks
