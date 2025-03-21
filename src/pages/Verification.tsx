import React from 'react';
import OttpCard from '../components/home/ottp/OttpCard';
import { useParams } from 'react-router-dom';

const Verification: React.FC = () => {
  const { id } = useParams();
  return (
    <div className='flex flex-col items-center justify-center h-screen font-onest'>
        <OttpCard id={id || ''} />
    </div>
  );
};

export default Verification;
