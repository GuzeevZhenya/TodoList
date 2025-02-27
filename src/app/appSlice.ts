import {createSlice} from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    error: null as string | null,
  },
  reducers: (create) => ({
    setAppError: create.reducer<{error: string | null}>((state, action) => {
      state.error = action.payload.error;
    }),
  }),
});

export const appReducer = appSlice.reducer;
export const {setAppError} = appSlice.actions;
