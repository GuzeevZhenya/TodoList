// import React from "react";
// import { handleServerNetworkError } from "./error-utils";
// import { AppDispatch, AppRootStateType } from "app/store";
// import { appActions } from "app/app.reducer";
// import { BaseThunkAPI, GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
// import { BaseResponse } from "api/todolists-api";

// export const thunkTryCatch = async <T>(
//   thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, unknown>,
//   logic: () => Promise<T>,
// ): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
//   const { dispatch, rejectWithValue } = thunkAPI;
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     return await logic();
//   } catch (e) {
//     handleServerNetworkError(e, dispatch);
//     return rejectWithValue(null);
//   } finally {
//     dispatch(appActions.setAppStatus({ status: "idle" }));
//   }
// };

// // export const thunkTryCatch = async <T>(
// //   thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null>,
// //   logic: () => Promise<T>,
// // ): Promise<T | null> => {
// //   const { dispatch, rejectWithValue } = thunkAPI;
// //   try {
// //     dispatch(appActions.setAppStatus({ status: "loading" }));
// //     return await logic();
// //   } catch (e) {
// //     handleServerNetworkError(e, dispatch);
// //     return rejectWithValue(null); // Здесь также можно указать конкретный тип ошибки
// //   } finally {
// //     dispatch(appActions.setAppStatus({ status: "idle" }));
// //   }
