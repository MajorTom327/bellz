import type { Account } from "@prisma/client";
import { isEmpty } from "ramda";
import React from "react";
import { Card, Table } from "react-daisyui";

type Props = {
  accounts: Account[];
};

export const OtherAccounts: React.FC<Props> = ({ accounts }) => {
  if (isEmpty(accounts)) return null;
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h3 className="font-primary">Accounts from other team's member</h3>
          </Card.Title>

          <Table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.name}</td>
                  <td>{account.balance}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

OtherAccounts.defaultProps = {};

export default OtherAccounts;
