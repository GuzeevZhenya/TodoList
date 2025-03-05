import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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

export const authReducer = authSlice.reducer;
export const authThunk = {};
export const {setIsLoggedIn, logout} = authSlice.actions;
