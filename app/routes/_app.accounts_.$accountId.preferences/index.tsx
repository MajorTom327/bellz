import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { isNil } from "ramda";
import { Button, Card } from "react-daisyui";
import { notFound } from "remix-utils";
import zod from "zod";
import AccountType from "~/refs/AccountType";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

import { FormControl } from "~/components/FormControl";
import { SelectControl } from "~/components/SelectControl";

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

  console.log("Account", { account });
  return (
    <>
      <Form method="POST">
        <Card>
          <Card.Body>
            <Card.Title className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl">Preferences</h1>
            </Card.Title>
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
              <option value={AccountType.Cash}>Cash</option>
              <option value={AccountType.Safe}>Safe</option>
              <option value={AccountType.Wallet}>Wallet</option>
              <option value={AccountType.Bank}>Bank</option>
            </SelectControl>

            <Card.Actions className="justify-end">
              <Button type="submit" color="primary">
                Save
              </Button>
            </Card.Actions>
          </Card.Body>
        </Card>
      </Form>
    </>
  );
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureUser(request);
  const formData = await request.formData();

  const data = Object.fromEntries(formData.entries());

  const cleanData = zod
    .object({
      name: zod.string(),
      accountType: zod.nativeEnum(AccountType),
    })
    .parse(data);

  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);

  const accountController = new AccountController();
  await accountController.updateAccount(accountId, user.id, cleanData);

  return json({});
};

export default AppAccounts$accountIdPreferences;
