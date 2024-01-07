import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { URL, conf } from "src/config";
import {
  getAccessToken,
  getRefreshToken,
  isLocalStorage,
  login,
  logout,
} from "../auth";
import { RefreshTokenRes } from "src/interfaces";
import { RootState } from "../store";
import { resetAuthData, setNewTokens } from "src/slices/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: URL.API,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.authUser.accessToken;
    if (accessToken) {
      headers.set(conf.AUTHORIZATION, `${conf.BEARER} ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === "PARSING_ERROR" &&
    result.error.originalStatus === 401
  ) {
    const refreshToken = getRefreshToken();
    // try to get a new token
    const refreshResult = await baseQuery(
      {
        url: URL.REFRESH,
        method: "POST",
        body: { RefreshToken: refreshToken },
      },
      api,
      extraOptions
    );
    const data = refreshResult.data as RefreshTokenRes;
    if (data) {
      // store the new token
      login(data.accessToken, data.refreshToken, isLocalStorage());
      api.dispatch(setNewTokens(data));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      logout();
      api.dispatch(resetAuthData());
    }
  }
  return result;
};

/**
 * API definition
 */
export const ApiTag = {
  Auth: "Auth",
  Expense: "Expense",
};

export const mainApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(ApiTag),
  endpoints: () => ({}),
  keepUnusedDataFor: 30,
});
