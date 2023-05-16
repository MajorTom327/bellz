import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useParams,
} from "@remix-run/react";
import { json } from "@vercel/remix";
import classNames from "classnames";
import { Tabs } from "react-daisyui";
import { badRequest, verifyAuthenticityToken } from "remix-utils";
import zod from "zod";
import AccountType from "~/refs/AccountType";
import { getSession } from "~/services.server/session";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppAccounts = () => {
  const params = useParams();
  const accountId = zod
    .object({ accountId: zod.string() })
    .parse(params).accountId;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="tabs tabs-boxed">
          <NavLink
            to={`/accounts/${accountId}`}
            end
            prefetch="intent"
            className={({ isActive }) =>
              classNames("tab tab-md", { "tab-active": isActive })
            }
          >
            Accounts
          </NavLink>
          <NavLink
            to={`/accounts/${accountId}/preferences`}
            end
            prefetch="intent"
            className={({ isActive }) =>
              classNames("tab tab-md", { "tab-active": isActive })
            }
          >
            Preferences
          </NavLink>
        </div>
        <Outlet />
      </div>
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
      accountType: zod.nativeEnum(AccountType),
    })

    .parse(data);

  const accountController = new AccountController();

  return await accountController
    .createAccount({
      label: account.label,
      balance: account.balance,
      userId: user.id,
      type: account.accountType,
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
      return badRequest({ message: error.message });
    });
};

export default AppAccounts;
