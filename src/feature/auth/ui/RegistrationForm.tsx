import { Button, Input, Form, Radio } from 'antd';
import './RegistrationForm.css';
import { useAppDispatch } from '../../../common/hooks/redux';
import { authThunk } from '../model/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRegistrationMutation } from '../api/logAPI';

export const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  const [registration] = useRegistrationMutation()

  const handleSubmit = async (values: any) => {
    const user = {
      ...values,
      age: parseInt(values.age, 10),
    };

    try {
      await registration(user).unwrap();
      setIsRegistered(true);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };


  if (isRegistered) {
    navigate('/login');
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <Form
          onFinish={(values) => handleSubmit(values)}
          className="registration-form"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Пожалуйста, введите username!' }]}
          >
            <Input placeholder="Введите имя пользователя" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email!' },
            ]}
          >
            <Input placeholder="your_user_name@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 8, message: 'Пароль должен содержать минимум 8 символов!' },
              {
                pattern: new RegExp('^(?=.*[A-Z]).*$'),
                message: 'Пароль должен содержать хотя бы одну заглавную букву!',
              },
              {
                pattern: new RegExp('^(?=.*[a-z]).*$'),
                message: 'Пароль должен содержать хотя бы одну прописную букву!',
              },
              {
                pattern: new RegExp('^(?=.*[0-9]).*$'),
                message: 'Пароль должен содержать хотя бы одну цифру!',
              },
              {
                pattern: new RegExp('^(?=.*[!@#$%^&*(),.?":{}|<>+=-]).*$'),
                message: 'Пароль должен содержать хотя бы один специальный символ!',
              },
            ]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>

          <Form.Item initialValue="male" label="Gender" name="gender">
            <Radio.Group
              optionType="button"
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <Radio.Button value="male">Мужчина</Radio.Button>
              <Radio.Button value="female">Женщина</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Введите ваш возраст' }]}
          >
            <Input type="number" placeholder="27" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
            <Button type="link" href="/login" block>
              У вас есть аккаунт? Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};