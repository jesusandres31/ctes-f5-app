import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { URL } from "src/config";
import { Order } from "src/types";

const baseQuery = fetchBaseQuery({
  baseUrl: URL.API,
  prepareHeaders: (headers) => {
    /* const accessToken = getAccessToken();
    if (accessToken) {
      headers.set(conf.AUTHORIZATION, `${conf.TOKEN_PREFIX} ${accessToken}`);
    } */
    return headers;
  },
});

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
//   if (
//     result.error &&
//     result.error.status === "PARSING_ERROR" &&
//     result.error.originalStatus === 401
//   ) {
//     const refreshToken = getRefreshToken();
//     // try to get a new token
//     const refreshResult = await baseQuery(
//       {
//         url: URL.REFRESH,
//         method: "POST",
//         body: { RefreshToken: refreshToken },
//       },
//       api,
//       extraOptions
//     );
//     const data = refreshResult.data as RefreshTokenRes;
//     if (data) {
//       // store the new token
//       login(data.accessToken, data.refreshToken, isLocalStorage());
//       api.dispatch(setNewTokens(data));
//       // retry the initial query
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       logout();
//       api.dispatch(resetAuthData());
//     }
//   }
//   return result;
// };

/**
 * API definition
 */
export const ApiTag = {
  Users: "users",
  Expenses: "expenses",
  ExpenseConcepts: "expense_concepts",
};

export const mainApi = createApi({
  baseQuery /* : baseQueryWithReauth */,
  tagTypes: Object.values(ApiTag),
  endpoints: () => ({}),
  keepUnusedDataFor: 30,
});

/**
 * utils
 */
export const getPbOrder = (order: Order) => {
  return order === "asc" ? "+" : "-";
};
