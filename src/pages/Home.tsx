import React, { useContext, useEffect } from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import CollaborationSection from '../components/home/CollaborationSection';
import AboutUsSection from '../components/home/AboutUsSection';
import CampaignsSection from '../components/home/CampaignsSection';
import OurFeatureSection from '../components/home/OurFeatureSection';
import ChooseUsSection from '../components/home/ChooseUsSection';
import Testimonials from '../components/home/Testimonials';

import FAQsSection from '../components/home/FAQsSection';

import { AuthContext } from '../context/userContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ScrollToTop from '../utils/ScrollToTop';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  profilePicture: "";
}


const Home: React.FC = () => {
  const { login } = useContext(AuthContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log(decodedUser);
        login(decodedUser as User, token);
        navigate('/'); // Redirect to homepage without the token in the URL
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [location]);


  return <div className=''>
    <ScrollToTop />
    <Navbar />
    <HeroSection />
    
    {/* <AboutUsSection /> */}
    <CampaignsSection />
    {/* <ChooseUsSection /> */}
    {/*<OurFeatureSection />
    <Testimonials />*/}

    <CollaborationSection />
    {/* <FAQsSection /> */}
    {/* <Footer /> */}
  </div>;
};

export default Home;
