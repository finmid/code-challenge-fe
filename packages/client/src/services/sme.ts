import { AuthService } from "./";

export const getSmeData = () => {
  return fetch("http://localhost:3000/sme-data", {
    // TODO: convert localhost string into an env variable
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${AuthService.getToken()}`,
    },
  });
};
