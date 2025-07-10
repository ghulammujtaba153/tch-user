import React, { useEffect } from 'react'
import OurFeatureSection from '../components/home/OurFeatureSection'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'
import { useAppConfig } from '../context/AppConfigContext'

const HowWorks = () => {
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `HowWork | ${config.name}`;
    }
  }, [config]);

  return (
    <div className='pt-20'>
      <ScrollToTop />
      <OurFeatureSection/>
      {/* <FAQsSection/> */}
      {/* <TestimonialSection/> */}
    </div>
  )
}

export default HowWorks
