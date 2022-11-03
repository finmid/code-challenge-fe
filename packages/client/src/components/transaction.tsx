import { useContext, useEffect, useState } from "react";

import { useParams, Link, Navigate, redirect } from "react-router-dom";

import { TransactionContext } from "../context/transactions";
import { UserData } from "../models/user";

import { Transaction } from "../../../lib-common/types";

import "./transaction.css";
import { UsersContext } from "../context/users";

export default function TransactionView() {
  const { getTransactions, transactions } = useContext(TransactionContext);
  const { users } = useContext(UsersContext);

  const [user, setUser] = useState<UserData>();
  const [transaction, setTransaction] = useState<Transaction>();
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  const getTransaction = (id: string): Transaction => {
    const transaction = transactions?.find(
      (transaction) => transaction.id === id
    );

    return transaction as Transaction;
  };

  const getUser = (id: string) => {
    const user = users?.find((user) => user.id === id);
    return user as UserData;
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    setTransaction(getTransaction(id as string));
  }, [id]);

  useEffect(() => {
    setUser(getUser(transaction?.userId as string));
    setLoading(false);
  }, [transaction]);

  const date = new Date(transaction?.transactionTime as string);

  const formatedDate =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  return (
    <div className="transaction-wrapper">
      <Link to={"/"}>
        <svg
          className="close-button"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="121.31px"
          height="122.876px"
          viewBox="0 0 121.31 122.876"
        >
          <g>
            <path d="M90.914,5.296c6.927-7.034,18.188-7.065,25.154-0.068 c6.961,6.995,6.991,18.369,0.068,25.397L85.743,61.452l30.425,30.855c6.866,6.978,6.773,18.28-0.208,25.247 c-6.983,6.964-18.21,6.946-25.074-0.031L60.669,86.881L30.395,117.58c-6.927,7.034-18.188,7.065-25.154,0.068 c-6.961-6.995-6.992-18.369-0.068-25.397l30.393-30.827L5.142,30.568c-6.867-6.978-6.773-18.28,0.208-25.247 c6.983-6.963,18.21-6.946,25.074,0.031l30.217,30.643L90.914,5.296L90.914,5.296z" />
          </g>
        </svg>
      </Link>
      {transaction ? (
        <div>
          <span className="transaction-data">
            <h3>Timestamp: </h3>
            <p>{formatedDate}</p>
          </span>
          <span className="transaction-data">
            <h3>Transaction status: </h3>
            <p>{transaction.status}</p>
          </span>
          <span className="transaction-data">
            <h3>Merchant: </h3>
            <p>{user?.name}</p>
          </span>
        </div>
      ) : (
        <>{!loading && <Navigate to="/" />}</>
      )}
    </div>
  );
}
