import { GetExpenseRes, GetExpenseConceptRes } from "src/interfaces";
import { ApiTag, getPbOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

const FK = {
  expense_concept: "expense_concept",
};

const F = {
  name: "name",
  detail: "detail",
  amount: "amount",
  unit_price: "unit_price",
  total: "total",
};

export const expenseApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<ListResult<GetExpenseRes>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.Expenses)
          .getList<GetExpenseRes>(_arg.page, _arg.perPage, {
            expand: FK.expense_concept,
            sort:
              _arg.order && _arg.orderBy
                ? `${getPbOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${F.detail} ~ "${_arg.filter}" ||
                ${F.detail} ~ "${_arg.filter}" ||
                ${F.amount} ~ "${_arg.filter}" ||
                ${F.unit_price} ~ "${_arg.filter}" ||
                ${F.total} ~ "${_arg.filter}" ||
                ${FK.expense_concept}.${F.name} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [ApiTag.Expenses],
    }),
    getExpenseConcepts: build.query<ListResult<GetExpenseConceptRes>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.ExpenseConcepts)
          .getList<GetExpenseConceptRes>(_arg.page, _arg.perPage, {
            sort:
              _arg.order && _arg.orderBy
                ? `${getPbOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${F.name} ~ "${_arg.filter}" || 
                ${F.detail} ~ "${_arg.filter}" ||
                ${F.unit_price} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [ApiTag.ExpenseConcepts],
    }),
    deleteExpense: build.mutation<PromiseSettledResult<void>[], string[]>({
      queryFn: async (_arg, _api, _options) => {
        const items = Array.isArray(_arg) ? _arg : [_arg];
        const res = await Promise.allSettled(
          items.map(async (id) => {
            await pb.collection(ApiTag.Expenses).delete(id);
          })
        );
        return { data: res };
      },
      invalidatesTags: [ApiTag.Expenses],
    }),
  }),
});
