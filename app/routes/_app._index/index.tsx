import type { Account } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import Bluebird from "bluebird";
import { pathOr } from "ramda";
import CurrencyEnum from "~/refs/CurrencyEnum";

import ensureUser from "~/lib/authorization/ensureUser";
import FinanceApi from "~/lib/finance";

import { AccountController } from "~/controllers/AccountController";

import ErrorHandler from "~/components/ErrorHandler";

import AccountCard from "./AccountCard";
import CreateAccount from "./CreateAccount";
import StatsBar from "./StatsBar";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);
  const accountsController = new AccountController();
  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  const accounts = await accountsController.getAccountsForUser(user.id);

  const financeApi = new FinanceApi();

  const totalBalance = await Bluebird.reduce(
    accounts,
    async (acc: number, account: Account) => {
      const { balance, currency: toCurrency } = account;
      if (toCurrency === currency) {
        return acc + balance;
      }

      const rate = await financeApi.getExchangeRate(
        toCurrency as CurrencyEnum,
        currency
      );

      console.log("Rate", { rate });

      return acc + balance * rate;
    },
    0
  );

  return json({
    accounts,
    totalBalance,
  });
};

export default function Index() {
  const { accounts, totalBalance } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <StatsBar accounts={accounts} totalBalance={totalBalance} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {accounts.map((account: Account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
      <CreateAccount />
    </>
  );
}

export const ErrorBoundary = ErrorHandler;
