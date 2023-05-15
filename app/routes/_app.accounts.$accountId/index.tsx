import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Card } from "react-daisyui";
import zod from "zod";

import { AccountController } from "~/controllers/AccountController";

import Transaction from "~/models/Transaction";

import { ButtonLink } from "~/components/ButtonLink";

import CreateTransaction from "./CreateTransaction";
import TransactionList from "./TransactionList";

export const loader: LoaderFunction = async ({ params }) => {
  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);

  const accountController = new AccountController();

  const transactions = await accountController.getTransactionsForAccount(
    accountId
  );
  return json({
    transactions,
  });
};

export const AppAccounts$accountId = () => {
  const { transactions } = useLoaderData<typeof loader>();

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl">Transactions</h1>
            <CreateTransaction />
          </Card.Title>
          <TransactionList transactions={transactions} />
        </Card.Body>
      </Card>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export default AppAccounts$accountId;
