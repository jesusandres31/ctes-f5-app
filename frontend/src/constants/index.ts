import { AppRoutes } from "src/config";
/**
 * validations
 */
export const VLDN = {
  EMAIL: { min: 5, max: 60 },
  PSSWD: { min: 4, max: 50 },
};

export const MSG = {
  required: "Required!",
  invalidEmail: "Invalid email",
  minLength: (len: number) => `Enter ${len} characters at least.`,
  maxLength: (len: number) => `Enter ${len} caracteres maximum.`,
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
