import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { notification } from "antd";

import { appActions } from "../../app/appSlice";

export function ErrorSnackbar() {
  const error = useSelector<RootState, string | null>(
    (state) => state.app.error
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Ошибка",
        description: error,
        duration: 6,
        placement: "topRight",
      });
      dispatch(appActions.setAppError({ error: null }));
    }
  }, [error, dispatch]);

  return null;
}