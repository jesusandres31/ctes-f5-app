import {
  configureStore,
  ConfigureStoreOptions,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { mainApi } from "./services/api";
import { uiReducer } from "src/slices";
import { setSnackbar } from "src/slices/ui/uiSlice";
import { PromiseStatus } from "src/types";

export const rtkQueryErrorLogger: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action) => {
    const actions = Array.isArray(action.payload)
      ? action.payload
      : [action.payload];
    (actions as any[]).forEach((action) => {
      if (action?.status === PromiseStatus.REJECTED) {
        dispatch(
          setSnackbar({
            message: action.reason.message ?? "Error in request.",
            type: "error",
          })
        );
      }
    });
    return next(action);
  };

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      [mainApi.reducerPath]: mainApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // disabling mieddleware for development mode only.
        // they are already disabled in builds.
        immutableCheck: false,
        serializableCheck: false,
      }).concat(mainApi.middleware, rtkQueryErrorLogger),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
