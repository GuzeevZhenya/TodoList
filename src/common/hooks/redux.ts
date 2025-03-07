import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
 import { AppDispatch,RootState } from "../../app/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelectore: TypedUseSelectorHook<RootState> = useSelector;
