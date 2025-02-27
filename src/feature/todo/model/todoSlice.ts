import {createSlice} from '@reduxjs/toolkit';
import {FilterValuesType, Todolist} from '../api/todolistsApi.types';

interface TodoState {
  todo: Todolist[];
}

const initialState: TodoState = {
  todo: [],
};

export const todoSlice = createSlice({
  initialState,
  name: 'todo',
  reducers: (create) => ({
    addTodolist: create.reducer<{todolist: Todolist}>((state, action) => {
      state.todo.unshift(action.payload.todolist);
    }),
    removeTodolist: create.reducer<{id: string}>((state, action) => {
      const index = state.todo.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) {
        state.todo.splice(index, 1);
      }
    }),
    updateTodolist: create.reducer<{todolist: Todolist}>((state, action) => {
      const index = state.todo.findIndex(
        (tl) => tl.id === action.payload.todolist.id,
      );
      if (index !== -1) {
        state.todo[index] = action.payload.todolist;
      }
    }),
    changeTodolistFilter: create.reducer<{
      id: string;
      filter: FilterValuesType;
    }>((state, action) => {
      const index = state.todo.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) {
        state.todo[index].filter = action.payload.filter;
      }
    }),
  }),
});

export const {
  addTodolist,
  removeTodolist,
  updateTodolist,
  changeTodolistFilter,
} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;
