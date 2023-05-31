import type { Account } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

import ErrorHandler from "~/components/ErrorHandler";

import AccountCard from "../_app._index/AccountCard";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);
  const accountController = new AccountController();

  const accounts = await accountController.getAccountsForUser(user.id);

  return json<LoaderData>({
    accounts,
  });
};

export const AppAccountsIndex = () => {
  const { accounts } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {accounts.map((account: Account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppAccountsIndex;
