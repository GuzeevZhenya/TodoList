import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Todolist} from './todolistsApi.types';

export const todoApi = createApi({
  reducerPath: 'todoApi',
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
  tagTypes: ['Todos'],
  endpoints: (build) => ({
    getAllTodos: build.query<Todolist[], void>({
      query: () => '/todos',
      providesTags: ['Todos'],
    }),
    addTodos: build.mutation({
      query: (post) => ({
        url: '/todos',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Todos'],
    }),
    removeTodo: build.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
    updateTodoTitle: build.mutation<Todolist, {id: string; title: string}>({
      query: ({id, title}) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body: {title},
      }),
      invalidatesTags: ['Todos'],
    }),
    toggleTodoCompletion: build.mutation<Todolist, {id: string}>({
      query: ({id}) => ({
        url: `/todos/${id}/isCompleted`,
        method: 'PATCH',
        // body: {isCompleted},
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetAllTodosQuery,
  useAddTodosMutation,
  useRemoveTodoMutation,
  useUpdateTodoTitleMutation,
  useToggleTodoCompletionMutation,
} = todoApi;
