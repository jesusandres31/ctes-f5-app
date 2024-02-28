import { Field, CreateFieldReq, UpdateItemReq } from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Prop {
  name = "name",
}

const TAG = ApiTag.Fields;

export const fieldApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getFields: build.query<ListResult<Field>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<Field>(_arg.page, _arg.perPage, {
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
    getField: build.query<Field, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<Field>(_arg);
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createField: build.mutation<Field, CreateFieldReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<Field>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateField: build.mutation<Field, UpdateItemReq<CreateFieldReq>>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).update<Field>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteField: build.mutation<PromiseSettledResult<void>[], string[]>({
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
