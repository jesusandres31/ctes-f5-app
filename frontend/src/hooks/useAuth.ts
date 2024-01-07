import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "src/app/services/authService";
import { getAccessToken, getRefreshToken, login, logout } from "src/app/auth";
import { AppRoutes, conf } from "src/config";
import { SignInReq } from "src/interfaces";
import { useAppDispatch } from "src/app/store";
import { setAuthData, resetAuthData } from "src/slices/auth/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const navigate = useNavigate();

  const handleSignIn = async (data: SignInReq) => {
    const res = await signIn(data).unwrap();
    login(res.accessToken, res.refreshToken, data.remember);
    dispatch(setAuthData(res));
    navigate(conf.LANDING_PAGE);
  };

  const handleSignOut = async () => {
    logout();
    dispatch(resetAuthData());
    navigate(AppRoutes.Login);
  };

  const handleCheckAuth = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (accessToken && refreshToken) {
      dispatch(setAuthData({ accessToken, refreshToken }));
    }
  };

  return {
    handleSignIn,
    handleSignOut,
    handleCheckAuth,
    isSigningIn,
  };
};
