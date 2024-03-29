import type { Account, Subscription } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import type { ReactElement } from "react";
import React from "react";
import { Table, Toggle } from "react-daisyui";
import { useAuthenticityToken } from "remix-utils";
import type AccountType from "~/refs/AccountType";
import type CurrencyEnum from "~/refs/CurrencyEnum";

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
  const csrf = useAuthenticityToken();
  const fetcher = useFetcher();

  const handleToggleSubscription = (subscription: Subscription) => () => {
    fetcher.submit(
      {
        csrf,
      },
      {
        method: "POST",
        action: `/subscriptions/${subscription.id}/toggle`,
      }
    );
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Subscription</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Next Payment</th>
            <th>Active</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) =>
            getAccountForSubscription(
              subscription,
              accounts
            )((account) => (
              <tr key={subscription.id}>
                <td>{subscription.name}</td>
                <td
                  className={classNames({
                    "text-success": subscription.amount > 0,
                    "text-error": subscription.amount < 0,
                  })}
                >
                  <MoneyFormat
                    value={subscription.amount}
                    currency={account.currency as CurrencyEnum}
                  />
                </td>
                <td>{subscription.occurence}</td>
                <td>
                  <DateFormat value={subscription.nextExecution} />
                </td>
                <td>
                  <Toggle
                    checked={subscription.active}
                    onChange={handleToggleSubscription(subscription)}
                  />
                </td>
                <td>
                  <ButtonLink
                    size="sm"
                    to={`/accounts/${account.id}`}
                    className="flex gap-2"
                  >
                    {getAccountIcon(account.type as AccountType)}
                    {account.name}
                  </ButtonLink>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

SubscriptionList.defaultProps = {};

export default SubscriptionList;
