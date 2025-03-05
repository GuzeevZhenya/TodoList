// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { todoSlice } from "../feature/todo/model/todoSlice";
import { appSlice } from "./appSlice";
import { authSlice } from "../feature/auth/model/authSlice";
import { todoApi } from "../feature/todo/api/todoApi";
import { authApi } from "../feature/auth/api/logAPI";

export const store = configureStore({
  reducer: {
    [todoSlice.name]: todoSlice.reducer,
    [appSlice.name]: appSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [todoApi.reducerPath]: todoApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(todoApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;