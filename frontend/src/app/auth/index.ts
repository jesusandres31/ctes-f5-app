import { key } from "src/config";

export const getAccessToken = () => {
  return (
    localStorage.getItem(key.ACCESS_TOKEN) ??
    sessionStorage.getItem(key.ACCESS_TOKEN)
  );
};

export const getRefreshToken = () => {
  return (
    localStorage.getItem(key.REFRESH_TOKEN) ??
    sessionStorage.getItem(key.REFRESH_TOKEN)
  );
};

export const isLocalStorage = () => {
  // if it's local storage it means that the session should be remembered
  return !!localStorage.getItem(key.ACCESS_TOKEN);
};

export const login = (
  accessToken: string,
  refreshToken: string,
  remember: boolean = false
) => {
  if (remember) {
    localStorage.setItem(key.ACCESS_TOKEN, accessToken);
    localStorage.setItem(key.REFRESH_TOKEN, refreshToken);
  } else {
    sessionStorage.setItem(key.ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(key.REFRESH_TOKEN, refreshToken);
  }
};

export const logout = () => {
  sessionStorage.removeItem(key.ACCESS_TOKEN);
  localStorage.removeItem(key.ACCESS_TOKEN);
  sessionStorage.removeItem(key.REFRESH_TOKEN);
  localStorage.removeItem(key.REFRESH_TOKEN);
};
