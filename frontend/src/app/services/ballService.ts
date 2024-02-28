import { Ball, CreateBallReq, UpdateItemReq } from "src/interfaces";
import { ApiTag, getPocketBaseOrder, mainApi } from "./api";
import { pb } from "src/libs";
import { ListResult } from "pocketbase";
import { GetList } from "src/types";

enum Prop {
  name = "name",
  detail = "detail",
}

const TAG = ApiTag.Balls;

export const ballApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getBalls: build.query<ListResult<Ball>, GetList>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(TAG)
          .getList<Ball>(_arg.page, _arg.perPage, {
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
    getBall: build.query<Ball, string>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).getOne<Ball>(_arg);
        return { data: res };
      },
      providesTags: [TAG],
    }),
    createBall: build.mutation<Ball, CreateBallReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).create<Ball>(_arg);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    updateBall: build.mutation<Ball, UpdateItemReq<CreateBallReq>>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb.collection(TAG).update<Ball>(_arg.id, _arg.data);
        return { data: res };
      },
      invalidatesTags: [TAG],
    }),
    deleteBall: build.mutation<PromiseSettledResult<void>[], string[]>({
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
