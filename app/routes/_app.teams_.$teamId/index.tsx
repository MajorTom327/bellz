import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { json } from "@vercel/remix";
import classNames from "classnames";
import { notFound } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

import { useOptionalUser } from "~/hooks/useUser";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  const teamController = new TeamController();

  const { teamId } = zod.object({ teamId: zod.string() }).parse(params);

  const team = await teamController.getTeamById(user.id, teamId);

  if (!team) {
    throw notFound({ message: "Team not found" });
  }

  return json<LoaderData>({
    team,
  });
};

export const AppTeams$teamId = () => {
  const params = useParams();
  const user = useOptionalUser();
  const { team } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="tabs tabs-boxed">
          <NavLink
            to={"/teams/" + params.teamId}
            end
            prefetch="intent"
            className={({ isActive }) =>
              classNames("tab tab-md", { "tab-active": isActive })
            }
          >
            Accounts
          </NavLink>
          {user?.id === team?.ownerId && (
            <NavLink
              to={"/teams/" + params.teamId + "/users"}
              end
              prefetch="intent"
              className={({ isActive }) =>
                classNames("tab tab-md", { "tab-active": isActive })
              }
            >
              Users
            </NavLink>
          )}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams$teamId;
