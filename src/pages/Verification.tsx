import React, { useEffect } from 'react';
import OttpCard from '../components/home/ottp/OttpCard';
import { useParams } from 'react-router-dom';
import { useAppConfig } from '../context/AppConfigContext';

const Verification: React.FC = () => {
  const { id } = useParams();
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Verification | ${config.name}`;
    }
  }, [config]);

  return (
    <div className='flex flex-col items-center justify-center h-screen font-onest'>
        <OttpCard id={id || ''} />
    </div>
  );
};

export default Verification;
