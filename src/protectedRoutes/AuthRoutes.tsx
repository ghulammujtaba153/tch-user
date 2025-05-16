import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/userContext';


const AuthRoutes: React.FC = () => {
  const navigate = useNavigate();

  const {user, loading} = useContext(AuthContext);


  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  
  return user ? null : <Outlet />;
};

export default AuthRoutes;