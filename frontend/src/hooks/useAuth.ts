import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "src/app/services/authService";
import { logout } from "src/app/auth";
import { AppRoutes, conf } from "src/config";
import { SignInReq } from "src/interfaces";
import { pb } from "src/libs";

export const useAuth = () => {
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const navigate = useNavigate();

  const handleSignIn = async (data: SignInReq) => {
    await signIn(data).unwrap();
    navigate(conf.LANDING_PAGE);
  };

  const handleSignOut = async () => {
    logout();
    navigate(AppRoutes.Login);
  };

  const isLoggedIn = pb.authStore.isValid;

  return {
    handleSignIn,
    handleSignOut,
    isSigningIn,
    isLoggedIn,
  };
};
