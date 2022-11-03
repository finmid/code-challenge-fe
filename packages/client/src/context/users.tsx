import { createContext, useState, ReactNode } from "react";

import { UsersService } from "../services";

import { UserData } from "../models/user";

interface UsersContext {
  getUsers: Function;
  users: Array<UserData> | undefined;
}

const defaultContext: UsersContext = {
  getUsers: () => {},
  users: undefined,
};

export const UsersContext = createContext(defaultContext);

type UsersProvider = {
  children: ReactNode;
};

export function UsersProvider({ children }: UsersProvider) {
  const getUsers = () => {
    UsersService.getUsers()
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((response) => {
        setState({ ...state, users: response });
      })
      .catch((res) => {
        console.error(res.error, res.message);
      });
  };

  const initialState = {
    ...defaultContext,
    getUsers,
  };

  const [state, setState] = useState(initialState);

  return (
    <UsersContext.Provider value={state}>{children}</UsersContext.Provider>
  );
}
