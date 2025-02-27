import { configureStore } from "@reduxjs/toolkit";
import { todoSlice } from "../feature/todo/model/todoSlice";


export const store = configureStore({
  reducer: {
    [todoSlice.name]: todoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch