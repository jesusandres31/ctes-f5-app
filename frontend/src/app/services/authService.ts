import { SignUpRes, SignInReq } from "src/interfaces";
import { ApiTag, mainApi } from "./api";

export const authApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<SignUpRes, SignInReq>({
      query: (data) => ({
        url: `/auth/signin`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [ApiTag.Auth],
    }),
  }),
});

export const { useSignInMutation } = authApi;
