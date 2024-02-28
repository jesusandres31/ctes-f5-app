import {
  ExpenseConcept,
  CreateExpenseConceptReq,
  UpdateItemReq,
} from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Prop {
  name = "name",
  detail = "detail",
  unit_price = "unit_price",
}

const TAG = ApiTag.ExpenseConcepts;

export const expenseConceptApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenseConcepts: build.query<ListResult<ExpenseConcept>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<ExpenseConcept>(_arg.page, _arg.perPage, {
            sort:
              _arg.order && _arg.orderBy
                ? `${getPocketBaseOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${Prop.name} ~ "${_arg.filter}" || 
                ${Prop.detail} ~ "${_arg.filter}" ||
                ${Prop.unit_price} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    getExpenseConcept: build.query<ExpenseConcept, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<ExpenseConcept>(_arg);
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createExpenseConcept: build.mutation<
      ExpenseConcept,
      CreateExpenseConceptReq
    >({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<ExpenseConcept>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateExpenseConcept: build.mutation<
      ExpenseConcept,
      UpdateItemReq<CreateExpenseConceptReq>
    >({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .update<ExpenseConcept>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteExpenseConcept: build.mutation<
      PromiseSettledResult<void>[],
      string[]
    >({
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
