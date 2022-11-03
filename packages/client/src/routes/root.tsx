import { useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { SmeDataService } from "../services";

import { loginContext } from "../context/user";
import { TransactionProvider } from "../context/transactions";
import { UsersProvider } from "../context/users";

import Dashboard from "../components/dashboard";

import Header from "../components/header";

import "../styles/root.css";

interface Sme {
  legalName: string;
}

export default function Root() {
  const { logged } = useContext(loginContext);

  const [sme, updateSme] = useState<Sme | undefined>();

  useEffect(() => {
    SmeDataService.getSmeData().then((data) => {
      data.json().then((data) => {
        updateSme(data);
      });
    });
  }, []);

  if (!logged) return <Navigate to="login" replace />;
  return (
    <>
      <Header companyName={sme?.legalName ?? ""} />
      <div className="dashboard-wrapper">
        <TransactionProvider>
          <UsersProvider>
            <Dashboard />
            <Outlet />
          </UsersProvider>
        </TransactionProvider>
      </div>
    </>
  );
}
