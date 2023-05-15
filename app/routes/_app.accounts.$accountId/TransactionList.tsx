import React from "react";
import { Table } from "react-daisyui";

import type Transaction from "~/models/Transaction";

import { DateFormat } from "~/components/DateFormat";
import { MoneyFormat } from "~/components/MoneyFormat";

type Props = {
  transactions: Transaction[];
};

export const TransactionList: React.FC<Props> = ({ transactions }) => {
  return (
    <>
      <Table className="w-full">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>
                <DateFormat value={transaction.date} />
              </td>
              <td>
                <MoneyFormat value={transaction.amount} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

TransactionList.defaultProps = {};

export default TransactionList;
