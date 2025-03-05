import {createSlice} from '@reduxjs/toolkit';
import {Todolist} from '../api/todolistsApi.types';
import {clearTodolists} from '../../../common/common.action';

interface TodoState {
  todo: Todolist[];
}

const initialState: TodoState = {
  todo: [],
};

export const todoSlice = createSlice({
  initialState,
  name: 'todo',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(clearTodolists, (state) => {
      state.todo = [];
    });
  },
});

export const todoReducer = todoSlice.reducer;
export const todolistThunk = {};
