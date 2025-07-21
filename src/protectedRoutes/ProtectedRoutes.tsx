import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/userContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const navigate = useNavigate();

  const {user, loading} = useContext(AuthContext);

  useEffect(() => {
    // Don't redirect while loading
    if (loading) {
      return;
    }

    // Check if user exists
    if (!user) {
      navigate('/signin');
      return;
    }

    // Check if user has required role
    const userRole = user.role;
    if (!allowedRoles.includes(userRole)) {
      navigate('/unauthorized');
      return;
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;