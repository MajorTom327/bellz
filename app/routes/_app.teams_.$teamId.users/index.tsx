import type { User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Card, Table } from "react-daisyui";
import { notFound } from "remix-utils";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

import UserRow from "./UserRow";

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
    users: await teamController.getUsersInTeam(teamId),
  });
};

export const AppTeams$teamIdUsers = () => {
  const { users } = useLoaderData<typeof loader>();

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Users</Card.Title>
          <Table className="w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppTeams$teamIdUsers;
