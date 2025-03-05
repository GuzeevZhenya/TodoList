import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelectore } from '../../feature/hooks/redux';

export const PublicRoute = () => {
  const isLoggedIn = useAppSelectore((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};