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
  selectedItems: string[];
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
  selectedItems: [],
};

export const isCollapsed = (collapsedItems: ICollapse[], itemId: number) => {
  return collapsedItems.some((item) => item.id === itemId);
};

export const isSelected = (selectedItems: string[], itemId: string) => {
  return selectedItems.some((selectedItem) => selectedItem === itemId);
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
    setSelectedItems(
      state: IUIState,
      { payload }: PayloadAction<string | string[]>
    ) {
      if (Array.isArray(payload)) {
        state.selectedItems = payload;
        return;
      }
      if (state.selectedItems.includes(payload)) {
        state.selectedItems = state.selectedItems.filter(
          (id) => id !== payload
        );
      } else {
        state.selectedItems = [...state.selectedItems, payload];
      }
    },
    resetSelectedItems(state: IUIState) {
      state.selectedItems = [];
    },
  },
});

export const {
  setCollapse,
  toggleOpenDrawer,
  setNavbar,
  setSnackbar,
  resetSnackbar,
  setSelectedItems,
  resetSelectedItems,
} = ui.actions;

export const useUISelector: TypedUseSelectorHook<RootState> = useSelector;

export default ui.reducer;
