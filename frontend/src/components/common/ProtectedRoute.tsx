import { Navigate } from "react-router-dom";
import { AppRoutes } from "src/config";
import { useAuthSelector } from "src/slices/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to={AppRoutes.Login} />;
  }
  return children;
};

export default ProtectedRoute;
