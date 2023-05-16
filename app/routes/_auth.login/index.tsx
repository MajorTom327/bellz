import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { omit } from "ramda";
import { Alert, Button, Card, Input } from "react-daisyui";
import { BiError } from "react-icons/bi";
import { unauthorized } from "remix-utils";
import zod from "zod";
import { sessionStorage } from "~/services.server/session";

import UserController from "~/controllers/UserController";

import ButtonLink from "~/components/ButtonLink";

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

export const AuthLogin = () => {
  const { error } = useLoaderData<typeof loader>();

  console.log(error);
  return (
    <>
      <Form method="POST" target="/login">
        <Card.Body>
          <Card.Title>
            <h1 className="text-2xl">Login</h1>
          </Card.Title>
          {error && (
            <Alert status="error" className="mb-4" icon={<BiError />}>
              {error}
            </Alert>
          )}
          <div className="form-control">
            <label className="label" htmlFor="#email">
              <span className="label-text">Email</span>
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              placeholder="Email"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="#password">
              <span className="label-text">Password</span>
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Password"
            />
          </div>
          <Card.Actions className="justify-end">
            <ButtonLink color="ghost" to="/signup">
              Signup
            </ButtonLink>
            <Button color="success" type="submit">
              Login
            </Button>
          </Card.Actions>
        </Card.Body>
      </Form>
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
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
      })
      .parse(data);

    const userController = new UserController();
    return userController
      .getUserByEmailAndPassword(user)
      .then(async (user) => {
        session.set("user", omit(["password"], user));

        return redirect("/", {
          headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
          },
        });
      })
      .catch(async (error) => {
        session.flash("error", "Invalid email or password");
        return unauthorized(
          {},
          {
            headers: {
              "Set-Cookie": await sessionStorage.commitSession(session),
            },
          }
        );
      });
  } catch (e) {
    session.flash("error", "Invalid email or password");
    return unauthorized(
      {},
      {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      }
    );
  }
};

export default AuthLogin;
