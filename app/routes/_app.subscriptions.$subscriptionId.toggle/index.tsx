import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import zod from "zod";

import ensureUser from "~/lib/authorization/ensureUser";

import SubscriptionController from "~/controllers/SubscriptionController";

import ErrorHandler from "~/components/ErrorHandler";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const AppSubscriptions$subscriptionIdToggle = () => {
  return <>AppSubscriptions$subscriptionIdToggle</>;
};

export const action: ActionFunction = async ({ request, params }) => {
  await ensureUser(request);
  const { subscriptionId } = zod
    .object({ subscriptionId: zod.string() })
    .parse(params);

  const subscriptionController = new SubscriptionController();
  return json(await subscriptionController.toggleSubscription(subscriptionId));
};

export const ErrorBoundary = ErrorHandler;

export default AppSubscriptions$subscriptionIdToggle;
