import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/userContext';


const AuthRoutes: React.FC = () => {
  const navigate = useNavigate();

  const {user} = useContext(AuthContext);


  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

  }, [user, navigate]);

  
  return user ? null : <Outlet />;
};

export default AuthRoutes;