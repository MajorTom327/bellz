import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppAccountsNew = () => {
  return <>AppAccountsNew</>;
};

export const action: ActionFunction = async () => {
  // * Create account
  return json({});
};

export default AppAccountsNew;
