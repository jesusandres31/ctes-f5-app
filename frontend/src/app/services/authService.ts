import { SignUpRes, SignInReq } from "src/interfaces";
import { ApiTag, mainApi } from "./api";
import { pb } from "src/libs";
import { RecordAuthResponse } from "pocketbase";

export const authApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<RecordAuthResponse<SignUpRes>, SignInReq>({
      queryFn: async (_arg, _api, _options) => {
        const res = await pb
          .collection(ApiTag.Users)
          .authWithPassword<SignUpRes>(_arg.email, _arg.password);
        return { data: res };
      },
    }),
  }),
});

export const { useSignInMutation } = authApi;
