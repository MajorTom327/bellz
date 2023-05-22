import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Card } from "react-daisyui";

import ErrorHandler from "~/components/ErrorHandler";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const Auth = () => {
  return (
    <>
      <div className="container mx-auto h-screen flex flex-col justify-center">
        <Card>
          <Outlet />
        </Card>
      </div>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default Auth;
