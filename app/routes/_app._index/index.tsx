import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Card } from "react-daisyui";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

import type Account from "~/models/Account";

import { MoneyFormat } from "~/components/MoneyFormat";

import CreateAccount from "./CreateAccount";
import StatsBar from "./StatsBar";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);
  const accountsController = new AccountController();

  const accounts = await accountsController.getAccountsForUser(user.id);

  return json({
    accounts,
  });
};

export default function Index() {
  const { accounts } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <StatsBar accounts={accounts} />
      <CreateAccount />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {accounts.map((account: Account) => (
          <Link
            key={account.id}
            to={`/accounts/${account.id}`}
            prefetch="intent"
          >
            <Card className="transform transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer">
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
        ))}
      </div>
    </div>
  );
}
