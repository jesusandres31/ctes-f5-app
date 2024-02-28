import { Client, CreateClientReq, UpdateItemReq } from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Prop {
  name = "name",
  phone = "phone",
}

const TAG = ApiTag.Clients;

export const clientApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query<ListResult<Client>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<Client>(_arg.page, _arg.perPage, {
            sort:
              _arg.order && _arg.orderBy
                ? `${getPocketBaseOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${Prop.name} ~ "${_arg.filter}" ||
                ${Prop.phone} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    getClient: build.query<Client, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<Client>(_arg);
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createClient: build.mutation<Client, CreateClientReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<Client>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateClient: build.mutation<Client, UpdateItemReq<CreateClientReq>>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).update<Client>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteClient: build.mutation<PromiseSettledResult<void>[], string[]>({
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
