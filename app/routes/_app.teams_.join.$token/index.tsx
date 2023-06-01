import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Button, Form } from "react-daisyui";
import {
  AuthenticityTokenInput,
  badRequest,
  verifyAuthenticityToken,
} from "remix-utils";
import zod from "zod";
import { sessionStorage } from "~/services.server/session";

import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import ErrorHandler from "~/components/ErrorHandler";

export const loader: LoaderFunction = async ({ request, params }) => {
  await ensureUser(request);

  return json({});
};

export const AppTeamsJoin = () => {
  const { token } = useParams();
  return (
    <>
      <Form method="POST" action={`/teams/join/${token}`}>
        <AuthenticityTokenInput />
        <Button type="submit">Join</Button>
      </Form>
    </>
  );
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  const userId = user.id;

  const { token } = zod
    .object({
      token: zod.string(),
    })
    .parse(params);

  await verifyAuthenticityToken(
    request,
    await sessionStorage.getSession(request.headers.get("Cookie") ?? "")
  );

  const teamController = new TeamController();

  const team = await teamController.acceptInvitation(token, userId);

  if (!team) {
    throw badRequest({ message: "Invalid token" });
  }

  return redirect(`/app/teams/${team.id}`);
};

export const ErrorBoundary = ErrorHandler;

export default AppTeamsJoin;
