import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { verifyAuthenticityToken } from "remix-utils";
import zod from "zod";
import { getSession } from "~/services.server/session";

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
  let session = await getSession(request.headers.get("Cookie"));
  await verifyAuthenticityToken(request, session);

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
