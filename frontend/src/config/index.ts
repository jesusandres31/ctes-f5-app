import packageJson from "../../package.json";

// envs
export const URL = {
  SERVER: `${import.meta.env.VITE_SERVER_URL}`,
  API: `${import.meta.env.VITE_SERVER_URL}/api`,
};

export const version = packageJson.version;

// application keys
export const key = {};

// application routing
export enum AppRoutes {
  Wildcard = "*",
  Index = "/",
  Login = "/login",
  Logout = "/logout",
  Profile = "/profile",
  Unauthorized = "/unauthorized",
  Expenses = "/expenses",
  ExpenseConcepts = "/expense-concepts",
  Incomes = "/incomes",
  IncomeConcepts = "/income-concepts",
}

// general config
export const conf = {
  LANDING_PAGE: AppRoutes.Expenses, // TODO: change this,
  AUTHORIZATION: "Authorization",
  TOKEN_PREFIX: "User",
};
