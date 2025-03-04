import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useAppDispatch, useAppSelectore } from '../../hooks/redux';
import { authThunk } from '../model/authSlice';
import './LoginPage.css';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelectore(state => state.auth.isLoggedIn);

  const handleSubmit = async (values: any) => {
    dispatch(authThunk.loginTC(values));
  };

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="login-container">
      <Form onFinish={handleSubmit} className="login-form">
        <h2>Авторизация</h2>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Введите email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
        <Form.Item>

          <Button type="link" href="/register" block>
            Нет аккаунта? Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

