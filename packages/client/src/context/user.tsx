import { createContext, useState, ReactNode } from "react";

import { isExpired, decodeToken } from "react-jwt";

import { AuthService } from "../services";
import { UserContext } from "../models/user";

const token = AuthService.getToken();

const defaultContext: UserContext = {
  logged: token && !isExpired(token) ? true : false,
  token: token && !isExpired(token) ? token : null,
  userData: token && !isExpired(token) ? decodeToken(token).userData : null,
  setLogged: ({ email, password }: { email: string; password: string }) => {},
  logOut: () => {},
  error: null,
};

export const loginContext = createContext(defaultContext);

type LoginProvider = {
  children: ReactNode;
};

export function LoginProvider({ children }: LoginProvider) {
  const setLogged = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    AuthService.login(email, password)
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((response) => {
        const decodedToken = decodeToken(response.token);
        const logged = response.token ? true : false;
        AuthService.setToken(response.token);
        setState({
          ...state,
          logged,
          token: response.token,
          userData: decodedToken.userData,
        });
      })
      .catch((res) => {
        res.json().then((response: any) => {
          AuthService.logout();
          setState({
            ...state,
            logged: false,
            token: null,
            userData: null,
            error: response,
          });
        });
      });
  };

  const logOut = () => {
    AuthService.logout();
    setState({
      logged: false,
      token: null,
      userData: null,
      setLogged,
      logOut,
      error: null,
    });
  };

  const initialState = {
    ...defaultContext,
    setLogged,
    logOut,
  };

  const [state, setState] = useState(initialState);

  return (
    <loginContext.Provider value={state}>{children}</loginContext.Provider>
  );
}
