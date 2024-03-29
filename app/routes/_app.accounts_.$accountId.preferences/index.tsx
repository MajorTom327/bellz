import type { Account } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { isNil } from "ramda";
import { Button, Card, Select } from "react-daisyui";
import { AuthenticityTokenInput, notFound } from "remix-utils";
import { match } from "ts-pattern";
import zod from "zod";
import AccountType from "~/refs/AccountType";

import ensureCsrf from "~/lib/authorization/ensureCsrf";
import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

import { ErrorHandler } from "~/components/ErrorHandler";
import { FormControl } from "~/components/FormControl";
import { SelectControl } from "~/components/SelectControl";
import TimedButton from "~/components/TimedButton";

type LoaderData = {
  account: Account;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);

  const accountController = new AccountController();

  const account = await accountController.getAccount(accountId);
  if (isNil(account)) {
    throw notFound({ message: "Account doens't exist" });
  }

  return json<LoaderData>({
    account,
  });
};

export const AppAccounts$accountIdPreferences = () => {
  const { account } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  const handleDisconnectFromAllTeams = async () => {
    fetcher.submit(
      {},
      {
        method: "POST",
        action: "/accounts/" + account.id + "/disconnect",
      }
    );
  };

  return (
    <>
      <Form method="POST">
        <Card>
          <Card.Body>
            <Card.Title className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl">Preferences</h1>
            </Card.Title>
            <AuthenticityTokenInput />
            <FormControl
              name="name"
              label="Name of the account"
              defaultValue={account.name}
            />
            <SelectControl
              label="Account Type"
              name="accountType"
              defaultValue={account.type}
            >
              <Select.Option value={AccountType.Cash}>Cash</Select.Option>
              <Select.Option value={AccountType.Safe}>Safe</Select.Option>
              <Select.Option value={AccountType.Wallet}>Wallet</Select.Option>
              <Select.Option value={AccountType.Bank}>Bank</Select.Option>
            </SelectControl>

            <Card.Actions className="justify-end">
              <Button type="submit" color="primary">
                Save
              </Button>
            </Card.Actions>
          </Card.Body>
        </Card>
      </Form>

      <Form method="DELETE">
        <Card className="bg-error/60 text-error-content">
          <Card.Body>
            <Card.Title className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl">Danger Zone</h1>
            </Card.Title>
            <div className="flex flex-col gap-2">
              <AuthenticityTokenInput />

              <Button
                type="button"
                color="warning"
                disabled={
                  fetcher.state === "submitting" || fetcher.type === "done"
                }
                onClick={handleDisconnectFromAllTeams}
              >
                Disconnect account from all teams
              </Button>

              <TimedButton
                name="action"
                value="delete-account"
                type="submit"
                color="error"
                duration={3000}
              >
                Delete account
              </TimedButton>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </>
  );
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  await ensureCsrf(request);
  const formData = await request.formData();

  const data = Object.fromEntries(formData.entries());

  console.log("Data", { data });

  return match(request.method)
    .with("DELETE", async () => {
      const { accountId } = zod
        .object({ accountId: zod.string() })
        .parse(params);

      const accountController = new AccountController();
      await accountController.deleteAccount(accountId, user.id);

      return redirect("/");
    })
    .otherwise(async () => {
      const cleanData = zod
        .object({
          name: zod.string(),
          accountType: zod.nativeEnum(AccountType),
        })
        .parse(data);

      const { accountId } = zod
        .object({ accountId: zod.string() })
        .parse(params);

      const accountController = new AccountController();
      await accountController.updateAccount(accountId, user.id, cleanData);

      return json({});
    });
};

export const ErrorBoundary = ErrorHandler;

export default AppAccounts$accountIdPreferences;
