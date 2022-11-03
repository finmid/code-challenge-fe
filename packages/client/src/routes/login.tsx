import { useContext, useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";

import { loginContext } from "../context/user";

import "../styles/login.css";

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Login() {
  const { logged, error, setLogged } = useContext(loginContext);

  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<UsernameFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLogged({
      email: event.currentTarget.elements.email.value,
      password: event.currentTarget.elements.password.value,
    });
    setLoading(false);
  }

  return logged ? (
    <Navigate to="/" />
  ) : (
    <div className="container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input type="email" id="email" required={true} />
            <label htmlFor="email">Email</label>
          </div>
          <div className="user-box">
            <input type="password" name="password" required={true} />
            <label htmlFor="password">Password</label>
          </div>
          <div className="login-button">
            <button>Login</button>
            {error && !loading && <h3 className="error">{error.message}</h3>}
          </div>
        </form>
      </div>
    </div>
  );
}
