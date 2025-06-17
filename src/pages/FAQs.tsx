import React from 'react'
import FAQsSection from '../components/home/FAQsSection'
import ScrollToTop from '../utils/ScrollToTop'

const FAQs = () => {
  return (
    <div className='pt-20'>
      <ScrollToTop />
      <FAQsSection/>
    </div>
  )
}

export default FAQs
