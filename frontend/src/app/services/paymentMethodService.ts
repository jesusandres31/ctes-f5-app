import {
  PaymentMethod,
  CreatePaymentMethodReq,
  UpdateItemReq,
} from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Prop {
  name = "name",
  detail = "detail",
}

const TAG = ApiTag.PaymentMethods;

export const paymentMethodApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getPaymentMethods: build.query<ListResult<PaymentMethod>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<PaymentMethod>(_arg.page, _arg.perPage, {
            sort:
              _arg.order && _arg.orderBy
                ? `${getPocketBaseOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${Prop.name} ~ "${_arg.filter}" || 
                ${Prop.detail} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    getPaymentMethod: build.query<PaymentMethod, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<PaymentMethod>(_arg);
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createPaymentMethod: build.mutation<PaymentMethod, CreatePaymentMethodReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<PaymentMethod>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updatePaymentMethod: build.mutation<
      PaymentMethod,
      UpdateItemReq<CreatePaymentMethodReq>
    >({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .update<PaymentMethod>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deletePaymentMethod: build.mutation<PromiseSettledResult<void>[], string[]>(
      {
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
      }
    ),
  }),
});
