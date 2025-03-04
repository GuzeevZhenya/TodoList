import 'antd/dist/reset.css';
import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorSnackbar } from '../common/components/ErrorSnackbar';
import { Button, Spin } from 'antd';
import { useAppDispatch, useAppSelectore } from '../feature/hooks/redux';
import { authThunk, setIsLoggedIn } from '../feature/auth/model/authSlice';
import { appActions } from './appSlice';

export const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelectore((state) => state.app.status);
  const isLoggedIn = useAppSelectore((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
      dispatch(setIsLoggedIn({ isLoggedIn: true }))
    } else {
      console.log('JWT Token not found in localStorage.');
      dispatch(appActions.setAppInitialized({ isInitialized: false }))

    }
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
  }, []);


  // if (status === 'loading') {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <Spin size="large" tip="Загрузка..." />
  //     </div>
  //   );
  // }

  const logOutHandler = () => {
    dispatch(authThunk.logoutTC()).unwrap().then(() => {
      navigate('/login');
    });
  };
  return (
    <div className="App">
      {isLoggedIn && (
        <Button onClick={logOutHandler} style={{ margin: '15px' }}>
          Выйти
        </Button>
      )}
      <Outlet />
      <ErrorSnackbar />
    </div>
  );
}
