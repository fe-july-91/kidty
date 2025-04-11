import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

export const RequireAuth = () => {
  const { authorized } = useContext(AuthContext);

  if (!authorized) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
