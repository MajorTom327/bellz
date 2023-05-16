import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@vercel/remix";
import { commitSession, getSession } from "~/services.server/session";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const AuthLogout = () => {
  return <>AuthLogout</>;
};

export const action: ActionFunction = async ({ request }) => {
  console.log("LOGOUT");
  const session = await getSession(request.headers.get("Cookie"));

  session.unset("user");
  return redirect("/login", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default AuthLogout;
