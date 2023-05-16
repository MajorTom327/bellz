import type { Account, Subscription } from "@prisma/client";
import type { ReactElement } from "react";
import React from "react";
import { Table } from "react-daisyui";
import type AccountType from "~/refs/AccountType";

import { getAccountIcon } from "~/lib/getAccountIcon";

import ButtonLink from "~/components/ButtonLink";
import { DateFormat } from "~/components/DateFormat";
import MoneyFormat from "~/components/MoneyFormat";

type Props = {
  subscriptions: Subscription[];
  accounts: Account[];
};

const getAccountForSubscription =
  (subscription: Subscription, accounts: Account[]) =>
  (cb: (account: Account) => ReactElement) => {
    const account = accounts.find(
      (account) => account.id === subscription.accountId
    );
    if (!account) {
      return null;
    }

    return cb(account);
  };

export const SubscriptionList: React.FC<Props> = ({
  subscriptions,
  accounts,
}) => {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Subscription</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Next Payment</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td>{subscription.name}</td>
              <td>
                <MoneyFormat value={subscription.amount} />
              </td>
              <td>{subscription.occurence}</td>
              <td>
                <DateFormat value={subscription.nextExecution} />
              </td>
              <td>
                {getAccountForSubscription(
                  subscription,
                  accounts
                )((account) => (
                  <ButtonLink
                    size="sm"
                    to={`/accounts/${account.id}`}
                    className="flex gap-2"
                  >
                    {getAccountIcon(account.type as AccountType)}
                    {account.name}
                  </ButtonLink>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

SubscriptionList.defaultProps = {};

export default SubscriptionList;
