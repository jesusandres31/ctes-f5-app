import { GetExpenseRes, GetExpenseConceptRes } from "src/interfaces";
import { ApiTag, mainApi } from "./api";
import { pb } from "src/libs";

const EXPENSE_CONCEPT = "expense_concept";

export const expenseApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<GetExpenseRes[], void>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.Expenses)
          .getFullList<GetExpenseRes>({ expand: EXPENSE_CONCEPT });
        return { data: res };
      },
      providesTags: [ApiTag.Expenses],
    }),
    getExpenseConcepts: build.query<GetExpenseConceptRes[], void>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.ExpenseConcepts)
          .getFullList<GetExpenseConceptRes>();
        return { data: res };
      },
      providesTags: [ApiTag.ExpenseConcepts],
    }),
  }),
});

export const { useGetExpensesQuery, useGetExpenseConceptsQuery } = expenseApi;
