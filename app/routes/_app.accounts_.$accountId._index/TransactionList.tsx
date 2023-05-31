import classNames from "classnames";
import { isNotNil } from "ramda";
import React from "react";
import { Badge, Table } from "react-daisyui";
import type CurrencyEnum from "~/refs/CurrencyEnum";

import type Transaction from "~/models/Transaction";

import { DateFormat } from "~/components/DateFormat";
import { MoneyFormat } from "~/components/MoneyFormat";

type Props = {
  transactions: Transaction[];
  currency: CurrencyEnum;
};

export const TransactionList: React.FC<Props> = ({
  transactions,
  currency,
}) => {
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
              <td>
                {transaction.description}
                {isNotNil(transaction.loanId) && (
                  <Badge className="ml-2" color="accent">
                    Loan
                  </Badge>
                )}
              </td>
              <td>
                <DateFormat value={transaction.date} />
              </td>
              <td
                className={classNames("font-semibold text-right", {
                  "text-error": transaction.amount < 0,
                  "text-success": transaction.amount > 0,
                })}
              >
                <MoneyFormat value={transaction.amount} currency={currency} />
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
