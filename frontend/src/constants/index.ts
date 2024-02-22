import { AppRoutes } from "src/config";
import { uiInitialState } from "src/slices/ui/uiSlice";

/**
 * style
 */
export const STYLE = {
  width: {
    textfield: 250,
  },
};

/**
 * pagination
 */
export const PAGE = {
  firstPage: 1,
  rowsPerPage: 20,
};

/**
 * title
 */
export const translateTitle = (title: string) => {
  switch (title) {
    case AppRoutes.Expenses:
      return "Egresos";
    case AppRoutes.ExpenseConcepts:
      return "Conceptos de Egresos";
    default:
      return title;
  }
};
