import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { json } from "@vercel/remix";
import { verifyAuthenticityToken } from "remix-utils";
import zod from "zod";
import { getSession } from "~/services.server/session";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppAccountsNew = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  // * Create account
  const user = await ensureUser(request);
  const session = await getSession(request.headers.get("Cookie"));
  await verifyAuthenticityToken(request, session);

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const account = zod
    .object({
      label: zod.string().min(1).max(255),
      balance: zod.coerce.number().transform((value) => value * 100),
    })

    .parse(data);

  const accountController = new AccountController();

  return await accountController
    .createAccount({
      label: account.label,
      balance: account.balance,
      userId: user.id,
    })
    .then((account) => {
      console.log("Account created", account);
      if (account.balance > 0) {
        return accountController
          .addTransactionToAccount(account.id, {
            description: "Initial balance",
            amount: account.balance,
            date: new Date(),
          })
          .then(() => {
            return redirect("/accounts/" + account.id);
          });
      }
      return redirect("/accounts/" + account.id);
    })
    .catch((error) => {
      console.log("Account creation failed", error);
      return redirect("/accounts/new");
    });
};

export default AppAccountsNew;
