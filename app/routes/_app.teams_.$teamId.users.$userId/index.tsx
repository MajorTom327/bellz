import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { badRequest, notFound } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

export const loader: LoaderFunction = async () => {
  return notFound({ message: "Not found" });
};

export const AppTeams$teamIdUsers$userId = () => {
  return <>AppTeams$teamIdUsers$userId</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  const method = request.method;

  const { teamId, userId } = zod
    .object({
      teamId: zod.string(),
      userId: zod.string(),
    })
    .parse(params);

  if (user.id === userId) {
    throw badRequest({ message: "You can't remove yourself from a team." });
  }
  const teamController = new TeamController();

  const team = await teamController.getTeamById(user.id, teamId);

  if (!team) {
    throw badRequest({ message: "Team not found" });
  }

  if (method === "DELETE") {
    await teamController.removeUserFromTeam(teamId, userId);
    return json({});
  }

  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams$teamIdUsers$userId;
