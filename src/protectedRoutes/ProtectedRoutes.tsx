import React, { use, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/userContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const navigate = useNavigate();

  const {user} = useContext(AuthContext);

  // const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    // const decodedToken = jwtDecode(token) as any;
    console.log(user);
    const userRole = user.role; 

    
    if (!allowedRoles.includes(userRole)) {
      navigate('/unauthorized');
      return;
    }
  }, [user, allowedRoles, navigate]);

  
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;