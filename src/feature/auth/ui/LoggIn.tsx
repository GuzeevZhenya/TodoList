import { Button, Form, Input, message } from 'antd';
import { useAppDispatch, useAppSelectore } from '../../../common/hooks/redux';
import { setIsLoggedIn } from '../model/authSlice';
import './LoginPage.css';
import { Navigate } from 'react-router-dom';
import { useLoginMutation } from '../api/logAPI';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelectore(state => state.auth.isLoggedIn);

  const [login, { isLoading, error }] = useLoginMutation()

  const handleSubmit = async (values: any) => {
    try {
      const response = await login(values).unwrap();
      if (response.token) {
        localStorage.setItem('jwtToken', response.token);
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
      }
    } catch (error) {
      message.error('Ошибка при входе');
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
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

