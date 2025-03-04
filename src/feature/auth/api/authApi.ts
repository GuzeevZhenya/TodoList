import {instance} from './apiClient';

export const login = (data: any) => {
  return instance.post('/auth/login', data);
};

export const register = (data: any) => {
  console.log(data);
  return instance.post('/users/register', data);
};

export const logout = () => {
  return instance.post('/auth/logout');
};

// export const me = () => {
//   return instance.get('')
// }
