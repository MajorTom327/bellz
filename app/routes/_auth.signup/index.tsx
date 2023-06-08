import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Alert, Button, Card } from "react-daisyui";
import { BiError } from "react-icons/bi";
import { AuthenticityTokenInput, badRequest } from "remix-utils";
import zod from "zod";
import { sessionStorage } from "~/services.server/session";

import ensureCsrf from "~/lib/authorization/ensureCsrf";

import UserController from "~/controllers/UserController";

import ButtonLink from "~/components/ButtonLink";
import ErrorHandler from "~/components/ErrorHandler";
import { FormControl } from "~/components/FormControl";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const error = session.get("error");

  return json<LoaderData>(
    {
      error,
    },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
};

export const AuthSignup = () => {
  const { error } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  const isSubmitting = state === "submitting";

  return (
    <>
      <Form method="POST">
        <Card.Body>
          <Card.Title>
            <h1 className="text-2xl">Signup</h1>
          </Card.Title>
          {error && (
            <Alert status="error" className="mb-4" icon={<BiError />}>
              {error}
            </Alert>
          )}

          <FormControl name="email" label="Email" required />
          <FormControl
            type="password"
            name="password"
            label="Password"
            required
          />
          <FormControl
            type="password"
            name="confirm"
            label="Confirm Password"
            required
          />
          <AuthenticityTokenInput />

          <Card.Actions className="justify-end">
            <ButtonLink color="ghost" to="/login">
              Login
            </ButtonLink>
            <Button
              color="success"
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Signup
            </Button>
          </Card.Actions>
        </Card.Body>
      </Form>
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  await ensureCsrf(request);
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  try {
    const user = zod
      .object({
        email: zod.string().email(),
        password: zod.string().min(8),
        confirm: zod.string().min(8),
      })
      .refine((data) => data.password === data.confirm, {})
      .parse(data);

    const userController = new UserController();
    await userController.createUser(user);

    return redirect("/login");
  } catch (e) {
    session.flash("error", "Invalid email or password");
    return badRequest(
      {},
      {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      }
    );
  }
};

export const ErrorBoundary = ErrorHandler;

export default AuthSignup;
