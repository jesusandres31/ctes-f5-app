import { Expense } from "src/interfaces";
import { ApiTag, mainApi } from "./api";

export const expenseApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<Expense[], void>({
      query: () => `expense`,
      providesTags: [ApiTag.Expense],
    }),
  }),
});

export const { useGetExpensesQuery } = expenseApi;
