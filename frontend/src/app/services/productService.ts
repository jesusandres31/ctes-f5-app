import { Product, CreateProductReq, UpdateItemReq } from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Prop {
  name = "name",
}

const TAG = ApiTag.Products;

export const productApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ListResult<Product>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<Product>(_arg.page, _arg.perPage, {
            sort:
              _arg.order && _arg.orderBy
                ? `${getPocketBaseOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${Prop.name} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    getProduct: build.query<Product, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<Product>(_arg);
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createProduct: build.mutation<Product, CreateProductReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<Product>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateProduct: build.mutation<Product, UpdateItemReq<CreateProductReq>>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .update<Product>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteProduct: build.mutation<PromiseSettledResult<void>[], string[]>({
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
