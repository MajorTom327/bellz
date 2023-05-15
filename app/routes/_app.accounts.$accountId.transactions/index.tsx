import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import zod from "zod";

import { AccountController } from "~/controllers/AccountController";

import { TransactionSchema } from "~/models/Transaction";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppAccounts$accountIdTransactions = () => {
  return <>AppAccounts$accountIdTransactions</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  console.log("action create transaction");

  const { accountId } = zod
    .object({
      accountId: zod.string(),
    })
    .parse(params);

  const formData = await request.formData();
  const data = {
    ...Object.fromEntries(formData.entries()),
    accountId,
  };

  const transaction = TransactionSchema.parse(data);

  const accountController = new AccountController();
  await accountController.addTransactionToAccount(accountId, transaction);

  return json({
    transaction,
  });
};

export default AppAccounts$accountIdTransactions;
