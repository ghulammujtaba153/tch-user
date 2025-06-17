import React from 'react'
import OurFeatureSection from '../components/home/OurFeatureSection'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'

const HowWorks = () => {
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
