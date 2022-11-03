import { useContext } from "react";

import { loginContext } from "../context/user";

import "./header.css";

export default function Header({ companyName = "" }: { companyName: string }) {
  const { userData, logOut } = useContext(loginContext);

  const onClick = () => {
    logOut();
  };

  return (
    <header className="header">
      <p className="company-name">{companyName}</p>
      <p className="user-name">{userData?.name}</p>
      <button onClick={onClick}>Logout</button>
    </header>
  );
}
