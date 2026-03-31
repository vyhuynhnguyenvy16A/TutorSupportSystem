
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toUpperCase() : ''; 
  console.log(userRole)

  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'STUDENT') {
      return <Navigate to="/app/overview" replace />;
    } else if (userRole === 'TUTOR') {
      return <Navigate to="/app/tutor/overview" replace />;
    } else if (userRole === 'ADMIN'){
      return <Navigate to="/admin" replace />; 
    } else {
      return <Navigate to="/" replace />
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;