import React, { useEffect } from 'react'
import AboutUsSection from '../components/home/AboutUsSection'
import ChooseUsSection from '../components/home/ChooseUsSection'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'
import { useAppConfig } from '../context/AppConfigContext'

const About = () => {
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `About | ${config.name}`;
    }
  }, [config]);

  return (
    <div className='pt-20'>
      <ScrollToTop />
        <AboutUsSection/>
        {/* <ChooseUsSection/> */}
        {/* <FAQsSection/> */}
      
    </div>
  )
}

export default About
