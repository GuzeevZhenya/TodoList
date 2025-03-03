import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://todo-redev.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  },
);
