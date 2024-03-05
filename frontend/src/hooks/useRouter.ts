import { useLocation, useNavigate } from "react-router-dom";

export const useRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoTo = (path: string) => {
    navigate(path);
  };

  const route = location.pathname;

  return {
    handleGoTo,
    route,
  };
};
