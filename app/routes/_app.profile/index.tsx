import type { Profile } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { json } from "@vercel/remix";
import { prop, propOr } from "ramda";
import { Button, Card, Select } from "react-daisyui";
import { AuthenticityTokenInput, verifyAuthenticityToken } from "remix-utils";
import zod from "zod";
import CurrencyEnum from "~/refs/CurrencyEnum";
import { commitSession, getSession } from "~/services.server/session";

import ensureCsrf from "~/lib/authorization/ensureCsrf";
import ensureUser from "~/lib/authorization/ensureUser";

import UserController from "~/controllers/UserController";

import ErrorHandler from "~/components/ErrorHandler";
import { FormControl } from "~/components/FormControl";
import { SelectControl } from "~/components/SelectControl";

import { useOptionalUser } from "~/hooks/useUser";

type LoaderData = {};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Bellz - Profile" }];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppProfile = () => {
  const user = useOptionalUser();
  const profile = prop("profile", user);
  return (
    <>
      <Form method="POST">
        <Card>
          <Card.Body>
            <Card.Title>
              <h1 className="text-2xl">My profile</h1>
            </Card.Title>

            <FormControl
              label="Objective"
              name="objective"
              type="number"
              // @ts-expect-error
              defaultValue={propOr(0, "objective", profile) / 100}
              required
            />
            <SelectControl
              label="Currency"
              name="currency"
              defaultValue={propOr(CurrencyEnum.EUR, "currency", profile)}
            >
              {Object.entries(CurrencyEnum).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {value}
                </Select.Option>
              ))}
            </SelectControl>

            <AuthenticityTokenInput />
            <Card.Actions className="flex justify-end">
              <Button type="submit">Save</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
      </Form>
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const user = await ensureUser(request);
  await ensureCsrf(request);

  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const cleanData = zod
    .object({
      objective: zod.coerce
        .number()
        .min(1)
        .transform((value) => value * 100),
      currency: zod.nativeEnum(CurrencyEnum),
    })
    .parse(data);

  const userController = new UserController();

  const profile = await userController.setProfile(user.id, cleanData);

  session.set("user", {
    ...user,
    profile,
  });

  return json(
    {
      profile,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export const ErrorBoundary = ErrorHandler;

export default AppProfile;
