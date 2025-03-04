import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {login, register} from '../api/authApi';
import {appActions} from '../../../app/appSlice';
import {handleServerNetworkError} from '../../utils/error-utils';
import {AppDispatch, RootState} from '../../../app/store';
import {clearTodolists} from '../../../common/common.action';
import {RegistrationResponse, LoginPayload, RegistrationPayload} from './Iauth';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('jwtToken');
    },
  },
});

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
    console.log(response.data && response.data.token);
    if (response.data && response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      dispatch(setIsLoggedIn({isLoggedIn: true}));
      dispatch(appActions.setAppInitialized({isInitialized: true}));
    }
    return {isLoggedIn: true};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Неверные учетные данные';
    dispatch(appActions.setAppError({error: errorMessage}));
    return rejectWithValue(errorMessage);
  }
});

const logoutTC = createAsyncThunk<{isLoggedIn: boolean}, void>(
  `${authSlice.name}/logout`,
  async (_, thunkAPI) => {
    const {dispatch} = thunkAPI;
    dispatch(authSlice.actions.logout());
    dispatch(appActions.setAppInitialized({isInitialized: false}));
    dispatch(clearTodolists());
    return {isLoggedIn: false};
  },
);

export const authReducer = authSlice.reducer;
export const authThunk = {registration, loginTC, logoutTC};
export const {setIsLoggedIn} = authSlice.actions;
