import packageJson from "../../package.json";

// envs
export const URL = {
  SERVER: `${import.meta.env.VITE_SERVER_URL}`,
  API: `${import.meta.env.VITE_SERVER_URL}/api`,
};

export const version = packageJson.version;

// application keys
export const key = {
  DRAWER: "drawer",
};

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
  Clients = "/clients",
  Rentals = "/rentals",
  Sales = "/sales",
  Products = "/products",
  Fields = "/fields",
  Balls = "/balls",
  PaymenMethods = "/payment-methods",
  StatsIncomes = "/stats/incomes",
  StatsClients = "/stats/clients",
  StatsProducts = "/stats/products",
}

// general config
export const conf = {
  LANDING_PAGE: AppRoutes.Rentals,
  AUTHORIZATION: "Authorization",
  TOKEN_PREFIX: "User",
};
