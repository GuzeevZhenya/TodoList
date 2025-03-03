import 'antd/dist/reset.css';
import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ErrorSnackbar } from '../common/components/ErrorSnackbar';
import { Button } from 'antd';
import { useAppDispatch } from '../feature/hooks/redux';
import { authThunk } from '../feature/auth/model/authSlice';

export const App = () => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {

    const token = localStorage.getItem('jwtToken');

    if (token) {
      setJwtToken(token);
    } else {
      console.log('JWT Token not found in localStorage.');
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const logOutHandler = () => {
    dispatch(authThunk.logout()).unwrap().then(() => {
      navigate('/login');
    });
  };
  return (
    <div className="App">
      <Button onClick={() => logOutHandler()} style={{ margin: "15px" }}>Log out</Button>
      <Outlet />
      <ErrorSnackbar />
    </div>
  );
}
