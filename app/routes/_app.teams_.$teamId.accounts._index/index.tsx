import type { Account } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { notFound } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

import { useOptionalUser } from "~/hooks/useUser";

import MyAccountsList from "./MyAccountsList";
import OtherAccounts from "./OtherAccounts";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  const { teamId } = zod.object({ teamId: zod.string() }).parse(params);
  const teamController = new TeamController();

  const team = await teamController.getTeamById(user.id, teamId);
  if (!team) {
    throw notFound({ message: "Team not found" });
  }
  return json<LoaderData>({
    team,
  });
};

export const AppTeams$teamIdIndex = () => {
  const { team } = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <>
      <div className="flex flex-col gap-2">
        <OtherAccounts
          accounts={team.accounts.filter(
            (account: Account) => account.ownerId !== user?.id
          )}
        />
        <MyAccountsList teamAccounts={team.accounts} />
      </div>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams$teamIdIndex;
