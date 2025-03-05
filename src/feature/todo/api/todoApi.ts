// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {Todolist} from './todolistsApi.types';

// interface AddTodoRequest {
//   title: string;
// }

// interface UpdateTodoTitleRequest {
//   id: string;
//   title: string;
// }

// interface ToggleTodoCompletionRequest {
//   id: string;
//   isCompleted: boolean;
// }

// export const todoApi = createApi({
//   reducerPath: 'todoApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'https://todo-redev.herokuapp.com/api',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('jwtToken');
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ['Todos'],
//   endpoints: (build) => ({
//     getAllTodos: build.query<Todolist[], void>({
//       query: () => '/todos',
//       providesTags: ['Todos'],
//     }),
//     addTodos: build.mutation<Todolist, AddTodoRequest>({
//       query: (post) => ({
//         url: '/todos',
//         method: 'POST',
//         body: post,
//       }),
//       invalidatesTags: ['Todos'],
//     }),
//     removeTodo: build.mutation<void, string>({
//       query: (id) => ({
//         url: `/todos/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Todos'],
//     }),
//     updateTodoTitle: build.mutation<Todolist, {id: string; title: string}>({
//       query: ({id, title}) => ({
//         url: `/todos/${id}`,
//         method: 'PATCH',
//         body: {title},
//       }),
//       invalidatesTags: ['Todos'],
//     }),
//     toggleTodoCompletion: build.mutation<Todolist, {id: string}>({
//       query: ({id}) => ({
//         url: `/todos/${id}/isCompleted`,
//         method: 'PATCH',
//         // body: {isCompleted},
//       }),
//       invalidatesTags: ['Todos'],
//     }),
//   }),
// });

// export const {
//   useGetAllTodosQuery,
//   useAddTodosMutation,
//   useRemoveTodoMutation,
//   useUpdateTodoTitleMutation,
//   useToggleTodoCompletionMutation,
// } = todoApi;

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Todolist} from './todolistsApi.types';

interface AddTodoRequest {
  title: string;
}

interface UpdateTodoTitleRequest {
  id: string;
  title: string;
}

interface ToggleTodoCompletionRequest {
  id: string;
  isCompleted: boolean;
}

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
    addTodos: build.mutation<Todolist, AddTodoRequest>({
      query: (post) => ({
        url: '/todos',
        method: 'POST',
        body: post,
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        const tempId = `temp-${Date.now()}`;

        const patchResult = dispatch(
          todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
            draft.push({id: tempId, title: arg.title, isCompleted: false});
          }),
        );

        try {
          const {data: newTodo} = await queryFulfilled;

          dispatch(
            todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
              const index = draft.findIndex((todo) => todo.id === tempId);
              if (index !== -1) {
                draft[index] = newTodo;
              }
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Todos'],
    }),
    removeTodo: build.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
            const index = draft.findIndex((todo) => todo.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Todos'],
    }),
    updateTodoTitle: build.mutation<Todolist, {id: string; title: string}>({
      query: ({id, title}) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body: {title},
      }),
      onQueryStarted: async ({id, title}, {dispatch, queryFulfilled}) => {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
            const index = draft.findIndex((todo) => todo.id === id);
            if (index !== -1) {
              draft[index].title = title;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Todos'],
    }),
    toggleTodoCompletion: build.mutation<Todolist, {id: string}>({
      query: ({id}) => ({
        url: `/todos/${id}/isCompleted`,
        method: 'PATCH',
      }),
      onQueryStarted: async ({id}, {dispatch, queryFulfilled}) => {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
            const index = draft.findIndex((todo) => todo.id === id);
            if (index !== -1) {
              draft[index].isCompleted = !draft[index].isCompleted;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
