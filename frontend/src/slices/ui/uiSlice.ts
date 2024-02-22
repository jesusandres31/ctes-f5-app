import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { AlertColor } from "@mui/material";
import { RootState } from "src/app/store";
import { Action, Entity, Order } from "src/types";
import { PAGE } from "src/constants";

interface ICollapse {
  id: number;
  open: boolean;
}

interface ISnackbar {
  message: string;
  type?: AlertColor;
  open?: boolean;
}

interface IActionModal {
  create: Entity | null;
  update: Entity | null;
  delete: Entity | null;
}

interface IUIState {
  openDrawer: boolean;
  collapse: number | null;
  navbar: string | null;
  snackbar: ISnackbar;
  selectedItems: string[];
  page: number;
  perPage: number;
  filter: string;
  order: Order;
  orderBy: string;
  actionModal: IActionModal;
}

export const uiInitialState: IUIState = {
  openDrawer: false,
  collapse: null,
  navbar: null,
  snackbar: {
    message: "",
    type: "success",
    open: false,
  },
  selectedItems: [],
  page: PAGE.firstPage,
  perPage: PAGE.rowsPerPage,
  filter: "",
  order: "desc",
  orderBy: "",
  actionModal: {
    create: null,
    update: null,
    delete: null,
  },
};

export const isCollapsed = (collapsedItems: ICollapse[], itemId: number) => {
  return collapsedItems.some((item) => item.id === itemId);
};

export const isSelected = (selectedItems: string[], itemId: string) => {
  return selectedItems.some((selectedItem) => selectedItem === itemId);
};

const ui = createSlice({
  name: "ui",
  initialState: uiInitialState,
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
      state.snackbar.type = payload.type ?? uiInitialState.snackbar.type;
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
    setFilter(state: IUIState, { payload }: PayloadAction<string>) {
      state.filter = payload;
    },
    toggleSortDirection(state: IUIState) {
      state.order = state.order === "asc" ? "desc" : "asc";
    },
    setOrderBy(state: IUIState, { payload }: PayloadAction<string>) {
      state.orderBy = payload;
    },
    setPage(state: IUIState, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
    resetSelectedItems(state: IUIState) {
      state.selectedItems = uiInitialState.selectedItems;
    },
    resetFilter(state: IUIState) {
      state.filter = uiInitialState.filter;
    },
    resetPage(state: IUIState) {
      state.page = uiInitialState.page;
    },
    openModal(
      state: IUIState,
      { payload }: PayloadAction<{ action: Action; entity: Entity }>
    ) {
      if (payload.action === "create") {
        state.actionModal.create = payload.entity;
      }
      if (payload.action === "update") {
        state.actionModal.update = payload.entity;
      }
      if (payload.action === "delete") {
        state.actionModal.delete = payload.entity;
      }
    },
    closeModal(state: IUIState) {
      state.actionModal = uiInitialState.actionModal;
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
  setFilter,
  toggleSortDirection,
  setOrderBy,
  setPage,
  resetSelectedItems,
  resetFilter,
  resetPage,
  openModal,
  closeModal,
} = ui.actions;

export const useUISelector: TypedUseSelectorHook<RootState> = useSelector;

export default ui.reducer;
