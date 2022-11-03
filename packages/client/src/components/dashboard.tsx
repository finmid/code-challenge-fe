import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import LoadingSpin from "react-loading-spin";

import { Transaction, TransactionStatusEnum } from "../../../lib-common/types";

import "./dashboard.css";

import { TransactionContext } from "../context/transactions";
import { UsersContext } from "../context/users";

const formatter = (currency: string) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  });
};

export default function dashboard() {
  const { getTransactions, transactions } = useContext(TransactionContext);
  const { getUsers } = useContext(UsersContext);

  const [status, setStatus] = useState<string | undefined>(undefined);
  const [offset, setOffset] = useState<string | undefined>(undefined);
  const [limit, setLimit] = useState<string | undefined>("10");
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getTransactions();
    getUsers();
  }, []);

  const setParams = (
    params: {
      status?: string;
      offset?: string;
      limit?: string;
      userId?: string;
    } = {}
  ) => {
    setStatus(
      params.status === "undefined" ? undefined : params.status || status
    );
    setOffset(params.offset || offset);
    setLimit(params.limit || limit || "10");
    setUserId(params.userId || userId);
  };

  const updateTransactions = () => {
    getTransactions({ status, offset, limit, userId });
  };

  useEffect(() => {
    updateTransactions();
  }, [status, offset, limit, userId]);

  const buildDashboard = (transaction: Transaction) => {
    return (
      <Link
        to={"invoices/" + transaction.id}
        key={transaction.id}
        className="transaction"
      >
        <p>{transaction.merchantName}</p>
        <img src={transaction.merchantIconUrl} alt="" className="image" />
        <p>{new Date(transaction.transactionTime).toLocaleDateString()}</p>
        <p>{formatter(transaction.currency).format(+transaction.amount)}</p>
      </Link>
    );
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="filter-wrapper">
          <div className="filter">
            <label>Status</label>
            <select
              name="status"
              id="status"
              onChange={(data) => setParams({ status: data.target.value })}
            >
              <option key={100} value="undefined" defaultChecked>
                All
              </option>
              {Object.entries(TransactionStatusEnum)
                .filter(([_, value]) => {
                  return value !== TransactionStatusEnum.Reversed;
                })
                .map(([_, status], index) => {
                  return (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="filter">
            <label>Offset</label>
            <input
              type="number"
              onChange={(data) => setParams({ offset: data.target.value })}
            ></input>
          </div>
          <div className="filter">
            <label>Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(data) => setParams({ limit: data.target.value })}
            ></input>
          </div>
          <div className="filter">
            <label>userId</label>
            <input
              type="string"
              onChange={(data) => setParams({ userId: data.target.value })}
            ></input>
          </div>
        </div>
        <div className="transactions-container">
          {transactions?.length ? (
            transactions.map((transaction) => {
              return buildDashboard(transaction);
            })
          ) : (
            <LoadingSpin />
          )}
        </div>
      </div>
    </>
  );
}
