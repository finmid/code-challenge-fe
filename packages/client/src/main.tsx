import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LoginProvider } from "./context/user";

import Root from "./routes/root";
import Login from "./routes/login";
import Transaction from "./components/transaction";

import "./styles/index.css";
import "./styles/cssreset.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <LoginProvider>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="invoices/:id" element={<Transaction />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </LoginProvider>
    </Router>
  </React.StrictMode>
);
