import type { Account } from "@prisma/client";
import { useFetcher, useParams } from "@remix-run/react";
import { pathOr, prop } from "ramda";
import React, { useEffect } from "react";
import { Button, Card, Table, Toggle } from "react-daisyui";
import type CurrencyEnum from "~/refs/CurrencyEnum";

import { MoneyFormat } from "~/components/MoneyFormat";

type Props = {
  teamAccounts: Account[];
};

export const MyAccountsList: React.FC<Props> = ({ teamAccounts }) => {
  const fetcher = useFetcher();
  const fetcherSubmit = useFetcher();

  const { teamId } = useParams();

  const isPartOfTeam = (accountId: string) =>
    teamAccounts.map(prop("id")).includes(accountId);

  useEffect(() => {
    fetcher.load("/accounts");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcherSubmit.state]);

  const handleToggleAccount = (accountId: string) => () => {
    fetcherSubmit.submit(
      {},
      {
        method: "PATCH",
        action: `/teams/${teamId}/accounts/${accountId}`,
      }
    );
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h3 className="font-primary">My Accounts</h3>
          </Card.Title>
          <Table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Balance</th>
                <th>Visible</th>
              </tr>
            </thead>
            <tbody>
              {(pathOr([], ["data", "accounts"], fetcher) as Account[]).map(
                (account: Account) => (
                  <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>
                      <MoneyFormat
                        value={account.balance}
                        currency={account.currency as CurrencyEnum}
                      />
                    </td>
                    <td>
                      <Toggle
                        name="isVisible"
                        color="accent"
                        checked={isPartOfTeam(account.id)}
                        onChange={handleToggleAccount(account.id)}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

MyAccountsList.defaultProps = {};

export default MyAccountsList;
