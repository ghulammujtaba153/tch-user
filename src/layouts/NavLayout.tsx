import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

const NavLayout: React.FC = () => {

    return (
        <div className=''>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default NavLayout;
