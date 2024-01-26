import { GetExpenseRes, GetExpenseConceptRes } from "src/interfaces";
import { ApiTag, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

const EXPENSE_CONCEPT = "expense_concept";

export const expenseApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<ListResult<GetExpenseRes>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.Expenses)
          .getList<GetExpenseRes>(_arg.page, _arg.perPage, {
            expand: EXPENSE_CONCEPT,
          });
        return { data: res };
      },
      providesTags: [ApiTag.Expenses],
    }),
    getExpenseConcepts: build.query<ListResult<GetExpenseConceptRes>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.ExpenseConcepts)
          .getList<GetExpenseConceptRes>(_arg.page, _arg.perPage);
        return { data: res };
      },
      providesTags: [ApiTag.ExpenseConcepts],
    }),
  }),
});
