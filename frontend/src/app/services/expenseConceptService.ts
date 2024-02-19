import {
  GetExpenseConceptRes,
  CreateExpenseConceptReq,
  ExpenseConcept,
} from "src/interfaces";
import { ApiTag, getPbOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Field {
  name = "name",
  detail = "detail",
  unit_price = "unit_price",
}

export const expenseConceptApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
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
              ? `${Field.name} ~ "${_arg.filter}" || 
                ${Field.detail} ~ "${_arg.filter}" ||
                ${Field.unit_price} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [ApiTag.ExpenseConcepts],
    }),
    createExpenseConcept: build.mutation<
      ExpenseConcept,
      CreateExpenseConceptReq
    >({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.ExpenseConcepts)
          .create<ExpenseConcept>(_arg);
        return { data: res };
      },
      invalidatesTags: [ApiTag.ExpenseConcepts],
    }),
    deleteExpenseConcept: build.mutation<
      PromiseSettledResult<void>[],
      string[]
    >({
      queryFn: async (_arg, _api, _options) => {
        const items = Array.isArray(_arg) ? _arg : [_arg];
        const res = await Promise.allSettled(
          items.map(async (id) => {
            await pb.collection(ApiTag.ExpenseConcepts).delete(id);
          })
        );
        return { data: res };
      },
      invalidatesTags: [ApiTag.ExpenseConcepts],
    }),
  }),
});
