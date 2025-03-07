import {Dispatch} from 'redux';
import axios from 'axios';
import {AppDispatch} from '../../app/store';
import {appActions} from '../../app/appSlice';

export const handleServerAppError = (
  data: any,
  dispatch: Dispatch,
  isGlobalError: boolean = true,
) => {
  if (isGlobalError) {
    if (data.messages.length) {
      dispatch(appActions.setAppError({error: data.messages[0]}));
    } else {
      dispatch(appActions.setAppError({error: 'Some error occurred'}));
    }
  }

  dispatch(appActions.setAppStatus({status: 'failed'}));
};

export const handleServerNetworkError = (
  err: unknown,
  dispatch: AppDispatch,
): void => {
  let errorMessage = 'Some error occurred';

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }
  dispatch(appActions.setAppError({error: errorMessage}));
  dispatch(appActions.setAppStatus({status: 'failed'}));
};
