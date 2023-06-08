import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@vercel/remix";
import { verifyAuthenticityToken } from "remix-utils";
import zod from "zod";
import { getSession } from "~/services.server/session";

import ensureCsrf from "~/lib/authorization/ensureCsrf";

import { AccountController } from "~/controllers/AccountController";

import { TransactionSchema } from "~/models/Transaction";

import ErrorHandler from "~/components/ErrorHandler";

export const loader: LoaderFunction = async ({ params }) => {
  return redirect(`/accounts/${params.accountId}`);
};

export const AppAccounts$accountIdTransactions = () => {
  return <>AppAccounts$accountIdTransactions</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  await ensureCsrf(request);

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

  return redirect("/accounts/" + accountId);
};

export const ErrorBoundary = ErrorHandler;

export default AppAccounts$accountIdTransactions;
