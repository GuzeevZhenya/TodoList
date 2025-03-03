// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { todoSlice } from "../feature/todo/model/todoSlice";
import { appSlice } from "./appSlice";
import { authSlice } from "../feature/auth/model/authSlice";

export const store = configureStore({
  reducer: {
    [todoSlice.name]: todoSlice.reducer,
    [appSlice.name]: appSlice.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;