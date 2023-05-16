import type { Account } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

import AccountCard from "./AccountCard";
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
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
