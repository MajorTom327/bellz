import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { notFound } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

import ErrorHandler from "~/components/ErrorHandler";

export const loader: LoaderFunction = async () => {
  throw notFound({
    message: "Not found",
  });
};

export const AppAccounts$accountIdDisconnect = () => {
  return <>AppAccounts$accountIdDisconnect</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  await ensureUser(request);
  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);

  const accountController = new AccountController();
  await accountController.removeAccountFromAllTeams(accountId);
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppAccounts$accountIdDisconnect;
