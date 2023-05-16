import type { Account } from "@prisma/client";
import { Link } from "@remix-run/react";
import classNames from "classnames";
import React from "react";
import { Card } from "react-daisyui";

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
              <h1 className="text-2xl font-primary">{account.name}</h1>
              <h2 className="text-xl font-primary">
                <MoneyFormat value={account.balance} />
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
