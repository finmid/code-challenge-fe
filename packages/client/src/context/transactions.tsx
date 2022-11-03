import { createContext, useState, ReactNode } from "react";

import { Transaction } from "../../../lib-common/types";

import { TransactionsService } from "../services";

interface TransactionContext {
  getTransactions: Function;
  transactions: Array<Transaction> | undefined;
}

const defaultContext: TransactionContext = {
  getTransactions: () => {},
  transactions: undefined,
};

export const TransactionContext = createContext(defaultContext);

type TransactionProvider = {
  children: ReactNode;
};

export function TransactionProvider({ children }: TransactionProvider) {
  const getTransactions = (
    params: {
      status?: string;
      offset?: string;
      limit?: string;
      userId?: string;
    } = {}
  ) => {
    TransactionsService.getTransactions(params)
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((response) => {
        setState({
          ...state,
          transactions: response.data,
        });
      })
      .catch((res) => {
        console.error(res.error, res.message);
      });
  };

  const initialState = {
    ...defaultContext,
    getTransactions,
  };

  const [state, setState] = useState(initialState);

  return (
    <TransactionContext.Provider value={state}>
      {children}
    </TransactionContext.Provider>
  );
}
