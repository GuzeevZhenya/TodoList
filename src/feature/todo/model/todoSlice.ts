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
    builder.addCase(toggleTodoCompletion.fulfilled, (state, action) => {
      const updatedTodo = action.payload; // Объект Todolist
      const index = state.todo.findIndex((tl) => tl.id === updatedTodo.id);
      if (index !== -1) {
        state.todo[index] = {...state.todo[index], ...updatedTodo};
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
    rejectValue: string;
  }
>(`${todoSlice.name}/login`, async (_, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  // dispatch(appActions.setAppStatus({status: 'loading'})); // исправить момент с загрузкой

  try {
    const response = await getTodolistAPI();
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return response.data;
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    return rejectWithValue(error.message || 'Ошибка при загрузке задач');
  }
});

export const addTodolistThunk = createAsyncThunk<
  Todolist,
  {title: string},
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(`${todoSlice.name}/addTodolist`, async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;

  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    const response = await addTodolistAPI(arg);
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return response.data;
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    const errorMessage =
      error.response?.data?.errors[0].msg || 'Неверные учетные данные';
    return rejectWithValue(errorMessage);
  }
});

export const removeTodolistThunk = createAsyncThunk<
  {id: string},
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(`${todoSlice.name}/removeTodolist`, async (id, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    await deleteTodolistAPI(id);
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return {id};
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    return rejectWithValue(error.message || 'Ошибка при удалении задачи');
  }
});

export const updateTodolistThunk = createAsyncThunk<
  Todolist,
  Todolist,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(`${todoSlice.name}/updateTodolist`, async (todolist, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    const response = await updateTodolistAPI(todolist.id, todolist.title);
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return response.data;
  } catch (error: any) {
    dispatch(appActions.setAppStatus({status: 'failed'}));
    return rejectWithValue(error.message || 'Ошибка при обновлении задачи');
  }
});

export const toggleTodoCompletion = createAsyncThunk<
  Todolist,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(`${todoSlice.name}/toggleTodoCompletion`, async (id, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    const response = await updateTodolistFilterAPI(id);

    if (Array.isArray(response.data) && response.data.length > 0) {
      const updatedTodo = response.data[0];
      dispatch(appActions.setAppStatus({status: 'succeeded'}));
      return updatedTodo;
    } else {
      throw new Error('Некорректный формат данных');
    }
  } catch (error: any) {
    dispatch(
      appActions.setAppError({
        error: error.message || 'Ошибка при обновлении задачи',
      }),
    );
    return rejectWithValue(error.message || 'Ошибка при обновлении задачи');
  }
});

export const {
  addTodolist,
  removeTodolist,
  updateTodolist,
  // changeTodolistFilter,
} = todoSlice.actions;

export const todoReducer = todoSlice.reducer;
export const todolistThunk = {
  fetchTodolist,
  addTodolistThunk,
  removeTodolistThunk,
  updateTodolistThunk,
};
