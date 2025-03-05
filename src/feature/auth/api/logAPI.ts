import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://todo-redev.herokuapp.com/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['auth'],
  endpoints: (build) => ({
    login: build.mutation<{token: string}, {email: string; password: string}>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: async (_, {queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled;
          localStorage.setItem('jwtToken', data.token);
        } catch (error) {
          console.error('Ошибка при входе:', error);
        }
      },
      invalidatesTags: ['auth'],
    }),
    registration: build.mutation<any, any>({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {useLoginMutation, useRegistrationMutation} = authApi;
