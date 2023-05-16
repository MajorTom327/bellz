import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { NavLink, Outlet, useParams } from "@remix-run/react";
import { json } from "@vercel/remix";
import classNames from "classnames";
import zod from "zod";

import AppAccounts$accountId from "../_app.accounts_.$accountId._index";

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

export const action: ActionFunction = async () => {
  return json({});
};

export default AppAccounts;
