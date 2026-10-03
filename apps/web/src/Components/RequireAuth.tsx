import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../Context/AuthContext';

export const RequireAuth = () => {
  const { authorized, checking } = useContext(AuthContext);

  // Wait for the session check before deciding where to go.
  if (checking) return null;
  if (!authorized) return <Navigate to="/login" />;

  return <Outlet />;
};
