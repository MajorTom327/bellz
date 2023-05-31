import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@vercel/remix";
import { badRequest } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  const userId = user.id;

  const { token } = zod
    .object({
      token: zod.string(),
    })
    .parse(params);

  const teamController = new TeamController();

  const team = await teamController.acceptInvitation(token, userId);

  if (!team) {
    throw badRequest({ message: "Invalid token" });
  }

  return redirect(`/app/teams/${team.id}`);
};

export const AppTeamsJoin = () => {
  return <>AppTeamsJoin</>;
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeamsJoin;
