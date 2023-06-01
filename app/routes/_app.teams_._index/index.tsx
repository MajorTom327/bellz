import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { promiseHash } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import { TeamController } from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

import CreateTeam from "./CreateTeam";
import TeamList from "./TeamList";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);

  const teamController = new TeamController();

  return json<LoaderData>(
    await promiseHash({
      teams: teamController.getTeamsForUser(user.id),
    })
  );
};

export const AppTeams = () => {
  const { teams } = useLoaderData<typeof loader>();
  return (
    <>
      <CreateTeam />
      <TeamList teams={teams} />
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const user = await ensureUser(request);

  const formData = await request.formData();

  const entries = Object.fromEntries(formData.entries());
  const data = zod
    .object({
      name: zod.string().min(3).max(255),
    })
    .parse(entries);

  const teamController = new TeamController();

  await teamController.createTeam(data.name, user.id);

  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams;
