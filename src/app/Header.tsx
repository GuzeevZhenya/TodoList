import React from 'react';
import { Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelectore } from '../common/hooks/redux';
import { logout } from '../feature/auth/model/authSlice';
import { appActions } from './appSlice';
import { clearTodolists } from '../common/common.action';
import { todoApi } from '../feature/todo/api/todoApi';

interface HeaderProps {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, isLoading }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logOutHandler = () => {
    dispatch(logout());
    dispatch(appActions.setAppInitialized({ isInitialized: false }));
    dispatch(clearTodolists());
    dispatch(todoApi.util.resetApiState());
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <h1>Todo App</h1>
      {isLoggedIn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLoading && <Spin size="large" />}
          <Button onClick={logOutHandler}>Выйти</Button>
        </div>
      )}
    </div>
  );
};