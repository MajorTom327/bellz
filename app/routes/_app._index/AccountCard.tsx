import type { Account } from "@prisma/client";
import { Link } from "@remix-run/react";
import classNames from "classnames";
import React from "react";
import { Badge, Card } from "react-daisyui";
import type AccountType from "~/refs/AccountType";
import type CurrencyEnum from "~/refs/CurrencyEnum";

import { getAccountIcon } from "~/lib/getAccountIcon";

import MoneyFormat from "~/components/MoneyFormat";

type Props = {
  account: Account;
};

export const AccountCard: React.FC<Props> = ({ account }) => {
  const classes = classNames(
    "transform transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer",
    {
      "bg-error text-error-content": account.balance < 0,
    }
  );

  return (
    <>
      <Link key={account.id} to={`/accounts/${account.id}`} prefetch="intent">
        <Card className={classes}>
          <Card.Body>
            <Card.Title className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-primary text-primary-content rounded-full p-2">
                  {getAccountIcon(account.type as AccountType)}
                </div>

                <h1 className="text-2xl font-primary">{account.name}</h1>
              </div>
              <h2 className="text-xl font-primary">
                <MoneyFormat
                  value={account.balance}
                  currency={account.currency as CurrencyEnum}
                />
              </h2>
            </Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </>
  );
};

AccountCard.defaultProps = {};

export default AccountCard;
