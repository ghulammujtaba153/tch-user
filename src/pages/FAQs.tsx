import React, { useEffect } from 'react'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'
import { useAppConfig } from '../context/AppConfigContext';

const FAQs = () => {
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `FAQs | ${config.name}`;
    }
  }, [config]);

  return (
    <div className='pt-20'>
      <ScrollToTop />
      <FAQsSection/>
    </div>
  )
}

export default FAQs
