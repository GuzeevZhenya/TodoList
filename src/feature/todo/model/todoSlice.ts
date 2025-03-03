import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Todolist} from '../api/todolistsApi.types';
import {AppDispatch, RootState} from '../../../app/store';
import {appActions} from '../../../app/appSlice';
import {
  addTodolistAPI,
  deleteTodolistAPI,
  getTodolistAPI,
  updateTodolistAPI,
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
    builder.addCase(fetchTodolist.fulfilled, (state, action) => {
      state.todo = action.payload.map((tl) => ({
        ...tl,
      }));
    });
    builder.addCase(addTodolistThunk.fulfilled, (state, action) => {
      state.todo.unshift(action.payload);
    });
    builder.addCase(removeTodolistThunk.fulfilled, (state, action) => {
      const index = state.todo.findIndex(
        (todo) => todo.id === action.payload.id,
      );
      if (index !== -1) state.todo.splice(index, 1);
    });
    builder.addCase(updateTodolistThunk.fulfilled, (state, action) => {
      const index = state.todo.findIndex(
        (todo) => todo.id === action.payload.id,
      );
      if (index !== -1) {
        state.todo[index] = action.payload;
      }
    });
    builder.addCase(clearTodolists, (state) => {
      state.todo = [];
    });
  },
});

export const fetchTodolist = createAsyncThunk<
  Todolist[],
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string; // Исправлено: теперь rejectValue принимает строку
  }
>(`${todoSlice.name}/login`, async (_, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;

  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    const response = await getTodolistAPI(); // Вызов API
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    console.log(response);
    return response.data; // Возвращаем данные для обработки в extraReducers
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    return rejectWithValue(error.message || 'Ошибка при загрузке задач');
  }
});

export const addTodolistThunk = createAsyncThunk<
  Todolist, // Возвращаемый тип
  {title: string}, // Тип аргумента
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string; // Тип ошибки
  }
>(`${todoSlice.name}/addTodolist`, async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;

  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    console.log(arg);
    const response = await addTodolistAPI(arg); // Вызов API

    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return response.data; // Возвращаем данные для обработки в extraReducers
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    const errorMessage =
      error.response?.data?.errors[0].msg || 'Неверные учетные данные';
    console.log(error.response?.data?.errors[0].msg);
    return rejectWithValue(errorMessage);
  }
});

export const removeTodolistThunk = createAsyncThunk<
  {id: string}, // Возвращаемый тип
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string; // Тип ошибки
  }
>(`${todoSlice.name}/removeTodolist`, async (id, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    await deleteTodolistAPI(id); // Вызов API
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return {id}; // Возвращаем id для обработки в extraReducers
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    return rejectWithValue(error.message || 'Ошибка при удалении задачи');
  }
});

export const updateTodolistThunk = createAsyncThunk<
  Todolist, // Возвращаемый тип
  Todolist,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string; // Тип ошибки
  }
>(`${todoSlice.name}/updateTodolist`, async (todolist, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    const response = await updateTodolistAPI(todolist.id, todolist.title); // Вызов API
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    console.log(response);
    return response.data; // Возвращаем данные для обработки в extraReducers
  } catch (error: any) {
    console.log(error);
    dispatch(appActions.setAppStatus({status: 'failed'}));
    return rejectWithValue(error.message || 'Ошибка при обновлении задачи');
  }
});
export const {
  addTodolist,
  removeTodolist,
  updateTodolist,
  changeTodolistFilter,
} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;
export const todolistThunk = {
  fetchTodolist,
  addTodolistThunk,
  removeTodolistThunk,
  updateTodolistThunk,
};
