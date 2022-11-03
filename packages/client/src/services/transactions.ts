import { AuthService } from "./";

import { decodeToken } from "react-jwt";

const token = AuthService.getToken();

export const getTransactions = (
  params: {
    status?: string;
    offset?: string;
    limit?: string;
    userId?: string;
  } = {}
) => {
  const url = new URL(`http://localhost:3000/transactions`);

  const filteredParams = Object.entries(params).filter((param) => {
    return param[1] !== undefined;
  });

  filteredParams.forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${token}`,
    },
  });
};
