import React from 'react'
import AboutUsSection from '../components/home/AboutUsSection'
import ChooseUsSection from '../components/home/ChooseUsSection'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'

const About = () => {
  return (
    <div className='pt-20'>
      <ScrollToTop />
        <AboutUsSection/>
        <ChooseUsSection/>
        {/* <FAQsSection/> */}
      
    </div>
  )
}

export default About
