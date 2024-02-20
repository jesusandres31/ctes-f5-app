import { CreateExpenseReq, Expense, UpdateExpenseReq } from "src/interfaces";
import { ApiTag, getPbOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum FK {
  expense_concept = "expense_concept",
}

enum Field {
  name = "name",
  detail = "detail",
  amount = "amount",
  unit_price = "unit_price",
  total = "total",
}

const TAG = ApiTag.Expenses;

export const expenseApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<ListResult<Expense>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<Expense>(_arg.page, _arg.perPage, {
            expand: FK.expense_concept,
            sort:
              _arg.order && _arg.orderBy
                ? `${getPbOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${Field.name} ~ "${_arg.filter}" ||
                ${Field.detail} ~ "${_arg.filter}" ||
                ${Field.amount} ~ "${_arg.filter}" ||
                ${Field.unit_price} ~ "${_arg.filter}" ||
                ${Field.total} ~ "${_arg.filter}" ||
                ${FK.expense_concept}.${Field.name} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    getExpense: build.query<Expense, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getOne<Expense>(_arg, { expand: FK.expense_concept });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createExpense: build.mutation<Expense, CreateExpenseReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<Expense>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateExpense: build.mutation<Expense, UpdateExpenseReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .update<Expense>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteExpense: build.mutation<PromiseSettledResult<void>[], string[]>({
      queryFn: async (_arg, _api, _options) => {
        const items = Array.isArray(_arg) ? _arg : [_arg];
        const res = await Promise.allSettled(
          items.map(async (id) => {
            await pb.collection(TAG).delete(id);
          })
        );
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
  }),
});
