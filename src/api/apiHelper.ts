export const prepareHeaders = (headers: Headers) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');
  return headers;
};
