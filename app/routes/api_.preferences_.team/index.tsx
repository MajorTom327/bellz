import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { isEmpty, prop } from "ramda";
import { badRequest, verifyAuthenticityToken } from "remix-utils";
import { s } from "vitest/dist/types-ad1c3f45";
import zod from "zod";
import { sessionStorage } from "~/services.server/session";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppPreferencesTeam = () => {
  return <>AppPreferencesTeam</>;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await ensureUser(request);
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  await verifyAuthenticityToken(request, session);

  const formData = await request.formData();
  const { teamId } = zod
    .object({
      teamId: zod.string(),
    })
    .parse(Object.fromEntries(formData.entries()));

  if (isEmpty(teamId)) {
    session.unset("teamId");
  } else {
    const teamController = new TeamController();

    const teams = await teamController.getTeamsForUser(user.id);

    if (!teams.map(prop("id")).includes(teamId)) {
      throw badRequest({ message: "Team not found" });
    }

    session.set("teamId", teamId);
  }

  return json(
    {
      teamId,
    },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
};

export const ErrorBoundary = ErrorHandler;

export default AppPreferencesTeam;
