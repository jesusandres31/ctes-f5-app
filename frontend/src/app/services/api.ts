import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PBOrder } from "src/libs/pocketbase";
import { Order } from "src/types";

const baseQuery = fetchBaseQuery({});

/**
 * API definition
 */
export const ApiTag = {
  Users: "users",
  Expenses: "expenses",
  ExpenseConcepts: "expense_concepts",
  Products: "products",
  Clients: "clients",
  Fields: "fields",
  Balls: "balls",
  Rentals: "rentals",
  PaymentMethods: "payment_methods",
};

export const mainApi = createApi({
  baseQuery,
  tagTypes: Object.values(ApiTag),
  endpoints: () => ({}),
  keepUnusedDataFor: 30,
});

/**
 * utils
 */
export const getPocketBaseOrder = (order: Order): PBOrder => {
  return order === "asc" ? "+" : "-";
};
