import { CreateRentalReq, Rental, UpdateItemReq } from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum FK {
  client = "client",
  field = "field",
}

enum Prop {
  name = "name",
  from = "from",
  to = "to",
}

const TAG = ApiTag.Rentals;

const expand = `${FK.client},${FK.field}`;

export const rentalApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getRentals: build.query<ListResult<Rental>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<Rental>(_arg.page, _arg.perPage, {
            expand,
            sort:
              _arg.order && _arg.orderBy
                ? `${getPocketBaseOrder(_arg.order)}${_arg.orderBy}`
                : "",
            filter: _arg.filter
              ? `${Prop.from} ~ "${_arg.filter}" ||
                ${Prop.to} ~ "${_arg.filter}" ||
                ${FK.client}.${Prop.name} ~ "${_arg.filter}" ||
                ${FK.field}.${Prop.name} ~ "${_arg.filter}"
              `
              : "",
          });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    getRental: build.query<Rental, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<Rental>(_arg, { expand });
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createRental: build.mutation<Rental, CreateRentalReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<Rental>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateRental: build.mutation<Rental, UpdateItemReq<CreateRentalReq>>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).update<Rental>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteRental: build.mutation<PromiseSettledResult<void>[], string[]>({
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
