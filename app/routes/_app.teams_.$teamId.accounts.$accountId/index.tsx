import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { badRequest, notFound } from "remix-utils";
import zod from "zod";

import ensureCsrf from "~/lib/authorization/ensureCsrf";
import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";
import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

export const loader: LoaderFunction = async () => {
  return notFound({ message: "Not found" });
};

export const AppTeams$teamIdAccounts$accountId = () => {
  return <>AppTeams$teamIdAccounts$accountId</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  await ensureCsrf(request);

  const { teamId, accountId } = zod
    .object({
      teamId: zod.string(),
      accountId: zod.string(),
    })
    .parse(params);

  const teamController = new TeamController();
  const accountController = new AccountController();

  await accountController.getAccount(accountId).then((account) => {
    if (!account || account.ownerId !== user.id) {
      throw badRequest({ message: "Account not found" });
    }

    return teamController.toggleAccount(teamId, accountId);
  });

  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams$teamIdAccounts$accountId;
