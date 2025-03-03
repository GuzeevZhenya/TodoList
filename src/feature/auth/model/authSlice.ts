import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {login, register} from '../api/authApi';
import {appActions} from '../../../app/appSlice';
import {handleServerNetworkError} from '../../utils/error-utils';
import {AppDispatch, RootState} from '../../../app/store';
import {clearTodolists} from '../../../common/common.action';

interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
  gender: string;
  age: number;
}

interface RegistrationResponse {
  id: number;
  username: string;
  email: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{isLogged: boolean}>) {
      state.isLoggedIn = action.payload.isLogged;
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('jwtToken');
    },
  },
});

export const {setIsLoggedIn} = authSlice.actions;

const registration = createAsyncThunk<
  RegistrationResponse,
  RegistrationPayload,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: null;
  }
>(`${authSlice.name}/registration`, async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;

  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));
    const response = await register(arg);
    dispatch(appActions.setAppStatus({status: 'succeeded'}));
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errorMessage =
        error.response.data.errors?.[0]?.msg || 'Ошибка регистрации';
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(errorMessage);
    } else {
      return rejectWithValue(null);
    }
  }
});

const loginTC = createAsyncThunk<
  {isLoggedIn: boolean},
  LoginPayload,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(`${authSlice.name}/login`, async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}));

    const response = await login(arg);
    dispatch(appActions.setAppStatus({status: 'succeeded'}));

    if (response.data && response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      dispatch(setIsLoggedIn({isLogged: true}));
    }
    return {isLoggedIn: true};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Неверные учетные данные';
    dispatch(appActions.setAppError({error: errorMessage}));
    return rejectWithValue(errorMessage);
  }
});

const logout = createAsyncThunk<{isLoggedIn: boolean}, void>(
  `${authSlice.name}/logout`,
  async (_, thunkAPI) => {
    const {dispatch} = thunkAPI;
    dispatch(clearTodolists());
    dispatch(authSlice.actions.logout());

    return {isLoggedIn: false};
  },
);

export const authReducer = authSlice.reducer;
export const {} = authSlice.actions;
export const authThunk = {registration, loginTC, logout};
