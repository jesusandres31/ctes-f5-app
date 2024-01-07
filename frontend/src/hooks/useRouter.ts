import { useLocation, useNavigate } from "react-router-dom";

export const useRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoTo = (path: string) => {
    navigate(path);
  };

  const getRouteTitle = () => {
    let str = location.pathname.replace(/\//g, "");
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getRoute = () => {
    return location.pathname;
  };

  return {
    handleGoTo,
    getRouteTitle,
    getRoute,
  };
};
