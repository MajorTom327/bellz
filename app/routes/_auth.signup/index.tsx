import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Button, Card, Input } from "react-daisyui";
import zod from "zod";

import UserController from "~/controllers/UserController";

import ButtonLink from "~/components/ButtonLink";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AuthSignup = () => {
  return (
    <>
      <Form method="POST">
        <Card.Body>
          <Card.Title>
            <h1 className="text-2xl">Signup</h1>
          </Card.Title>
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
          <div className="form-control">
            <label className="label" htmlFor="#confirm-password">
              <span className="label-text">Confirm Password</span>
            </label>
            <Input
              id="confirm-password"
              type="password"
              name="confirm"
              required
              placeholder="Password"
            />
          </div>
          <Card.Actions className="justify-end">
            <ButtonLink color="ghost" to="/login">
              Login
            </ButtonLink>
            <Button color="success" type="submit">
              Signup
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

  const user = zod
    .object({
      email: zod.string().email(),
      password: zod.string().min(8),
      confirm: zod.string().min(8),
    })
    .refine((data) => data.password === data.confirm, {})
    .parse(data);

  const userController = new UserController();
  console.log("Creating user with email", user);
  console.log(await userController.createUser(user));
  return json({});
};

export default AuthSignup;
