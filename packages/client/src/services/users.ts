import { AuthService } from "./";

export const getUsers = () => {
  return fetch("http://localhost:3000/users", {
    // TODO: convert localhost string into an env variable
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${AuthService.getToken()}`,
    },
  });
};
