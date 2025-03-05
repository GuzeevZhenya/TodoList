import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Todolist} from '../api/todolistsApi.types';
import {AppDispatch, RootState} from '../../../app/store';
import {appActions} from '../../../app/appSlice';
import {
  addTodolistAPI,
  deleteTodolistAPI,
  getTodolistAPI,
  updateTodolistAPI,
  updateTodolistFilterAPI,
} from '../api/todolistsApi';
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
      isCompleted: boolean;
    }>((state, action) => {
      const index = state.todo.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) {
        state.todo[index].isCompleted = action.payload.isCompleted;
      }
    }),
  }),
  extraReducers: (builder) => {
    // builder.addCase(fetchTodolist.fulfilled, (state, action) => {
    //   state.todo = action.payload.map((tl) => ({
    //     ...tl,
    //   }));
    // });
    // builder.addCase(addTodolistThunk.fulfilled, (state, action) => {
    //   state.todo.unshift(action.payload);
    // });
    // builder.addCase(removeTodolistThunk.fulfilled, (state, action) => {
    //   const index = state.todo.findIndex(
    //     (todo) => todo.id === action.payload.id,
    //   );
    //   if (index !== -1) state.todo.splice(index, 1);
    // });
    // builder.addCase(updateTodolistThunk.fulfilled, (state, action) => {
    //   const index = state.todo.findIndex(
    //     (todo) => todo.id === action.payload.id,
    //   );
    //   if (index !== -1) {
    //     state.todo[index] = action.payload;
    //   }
    // });
    // builder.addCase(toggleTodoCompletion.fulfilled, (state, action) => {
    //   const updatedTodo = action.payload; // Объект Todolist
    //   const index = state.todo.findIndex((tl) => tl.id === updatedTodo.id);
    //   if (index !== -1) {
    //     state.todo[index] = {...state.todo[index], ...updatedTodo};
    //   }
    // });
    builder.addCase(clearTodolists, (state) => {
      state.todo = [];
    });
  },
});

export const {
  addTodolist,
  removeTodolist,
  updateTodolist,
  // changeTodolistFilter,
} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;
export const todolistThunk = {};
