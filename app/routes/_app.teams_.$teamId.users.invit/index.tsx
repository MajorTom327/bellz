import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { badRequest } from "remix-utils";
import zod from "zod";

import ensureCsrf from "~/lib/authorization/ensureCsrf";
import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppTeams$teamIdUsersInvit = () => {
  return <>AppTeams$teamIdUsersInvit</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  await ensureCsrf(request);
  const userId = user.id;

  const { teamId } = zod
    .object({
      teamId: zod.string(),
    })
    .parse(params);

  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  const data = zod
    .object({
      email: zod.string().email(),
    })
    .parse(entries);

  const teamController = new TeamController();

  const team = await teamController.getTeamById(userId, teamId);

  if (!team) {
    throw badRequest({ message: "Invalid team" });
  }

  await teamController.invitUser(teamId, data.email);

  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams$teamIdUsersInvit;
