import { GetExpenseRes } from "src/interfaces";
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
      providesTags: [ApiTag.Expenses],
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
