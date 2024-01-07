import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { AlertColor } from "@mui/material";
import { RootState } from "src/app/store";

interface ICollapse {
  id: number;
  open: boolean;
}

interface ISnackbar {
  message: string;
  type?: AlertColor;
  open?: boolean;
}

interface IUIState {
  openDrawer: boolean;
  collapse: number | null;
  navbar: string | null;
  snackbar: ISnackbar;
}

const initialState: IUIState = {
  openDrawer: false,
  collapse: null,
  navbar: null,
  snackbar: {
    message: "",
    type: "success",
    open: false,
  },
};

export const isCollapsed = (collapsedItems: ICollapse[], itemId: number) => {
  return collapsedItems.some((item) => item.id === itemId);
};

const ui = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleOpenDrawer(state: IUIState) {
      state.openDrawer = !state.openDrawer;
    },
    setCollapse(state: IUIState, { payload }: PayloadAction<number | null>) {
      state.collapse = payload;
    },
    setNavbar(state: IUIState, { payload }: PayloadAction<string | null>) {
      state.navbar = payload;
    },
    setSnackbar(state: IUIState, { payload }: PayloadAction<ISnackbar>) {
      state.snackbar.message = payload.message;
      state.snackbar.type = payload.type ?? initialState.snackbar.type;
      state.snackbar.open = payload.open ?? true;
    },
    resetSnackbar(state: IUIState) {
      state.snackbar.open = false;
    },
  },
});

export const {
  setCollapse,
  toggleOpenDrawer,
  setNavbar,
  setSnackbar,
  resetSnackbar,
} = ui.actions;

export const useUISelector: TypedUseSelectorHook<RootState> = useSelector;

export default ui.reducer;
