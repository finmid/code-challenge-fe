import { redirect } from "react-router-dom";

export const login = (email: string, password: string) => {
  return fetch("http://localhost:3000/login", {
    // TODO: convert localhost string into an env variable
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const logout = () => {
  localStorage.removeItem("token");
  return redirect("/login");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};
