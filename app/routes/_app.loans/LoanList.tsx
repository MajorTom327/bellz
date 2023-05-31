import type { Loan } from "@prisma/client";
import React from "react";
import { Progress, Table } from "react-daisyui";
import type CurrencyEnum from "~/refs/CurrencyEnum";

import { MoneyFormat } from "~/components/MoneyFormat";

type Props = {
  loans: Loan[];
};

export const LoanList: React.FC<Props> = ({ loans }) => {
  return (
    <>
      <Table className="w-full">
        <thead>
          <tr>
            <th>Label</th>
            <th>Amount</th>
            <th>Refunded</th>
            <th>Currency</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.label}</td>
              <td>
                <MoneyFormat
                  value={loan.amount}
                  currency={loan.currency as CurrencyEnum}
                />
              </td>
              <td>
                <MoneyFormat
                  value={loan.refunded}
                  currency={loan.currency as CurrencyEnum}
                />
              </td>
              <td>{loan.currency}</td>
              <td>
                <Progress
                  color="primary"
                  value={loan.refunded}
                  max={loan.amount}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

LoanList.defaultProps = {};

export default LoanList;
