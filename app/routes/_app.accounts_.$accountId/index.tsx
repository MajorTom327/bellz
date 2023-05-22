import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { json } from "@vercel/remix";
import classNames from "classnames";
import { Card } from "react-daisyui";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";
import { getAccountIcon } from "~/lib/getAccountIcon";

import { AccountController } from "~/controllers/AccountController";

import ErrorHandler from "~/components/ErrorHandler";
import { MoneyFormat } from "~/components/MoneyFormat";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request, params }) => {
  await ensureUser(request);

  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);

  const accountController = new AccountController();
  const account = await accountController.getAccount(accountId);

  return json<LoaderData>({
    account,
  });
};

export const AppAccounts = () => {
  const params = useParams();
  const accountId = zod
    .object({ accountId: zod.string() })
    .parse(params).accountId;

  const { account } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <Card>
          <Card.Body>
            <Card.Title className="flex gap-2 justify-between">
              <div className="flex gap-2 items-center">
                <div className="bg-primary text-primary-content rounded-full p-2">
                  {getAccountIcon(account.type)}
                </div>
                <h1 className="text-2xl">{account.name}</h1>
              </div>

              <h2 className="text-2xl">
                <MoneyFormat
                  value={account.balance}
                  currency={account.currency}
                />
              </h2>
            </Card.Title>
          </Card.Body>
        </Card>
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

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppAccounts;
