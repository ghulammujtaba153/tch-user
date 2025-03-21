import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const navigate = useNavigate();

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      // If no token, redirect to login
      navigate('/signin');
      return;
    }

    // Decode the token to get user details
    const decodedToken = jwtDecode(token) as any;
    console.log(decodedToken);
    const userRole = decodedToken.role; // Assuming the role is stored in the token

    // Check if the user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      navigate('/unauthorized');
      return;
    }
  }, [token, allowedRoles, navigate]);

  // If the user is authenticated and has the correct role, render the nested routes
  return token ? <Outlet /> : null;
};

export default ProtectedRoute;