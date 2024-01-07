import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "src/app/store";
import { RefreshTokenRes, SignUpRes } from "src/interfaces";

interface IAuthState {
  authUser: SignUpRes;
  isLoggedIn: boolean;
}

const initialState: IAuthState = {
  authUser: {
    accessToken: "",
    refreshToken: "",
  },
  isLoggedIn: false,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state: IAuthState, { payload }: PayloadAction<SignUpRes>) {
      state.authUser.accessToken = payload.accessToken;
      state.authUser.refreshToken = payload.refreshToken;
      state.isLoggedIn = true;
    },
    setNewTokens(
      state: IAuthState,
      { payload }: PayloadAction<RefreshTokenRes>
    ) {
      state.authUser.accessToken = payload.accessToken;
      state.authUser.refreshToken = payload.refreshToken;
    },
    resetAuthData(state: IAuthState) {
      state.authUser = initialState.authUser;
      state.isLoggedIn = initialState.isLoggedIn;
    },
  },
});

export const { setAuthData, setNewTokens, resetAuthData } = auth.actions;

export const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector;

export default auth.reducer;
