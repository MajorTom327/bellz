import type { LoaderFunction } from "@remix-run/node";
import { json } from "@vercel/remix";
import { cors, unauthorized } from "remix-utils";

import SubscriptionController from "~/controllers/SubscriptionController";

import ErrorHandler from "~/components/ErrorHandler";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const apiKey = url.searchParams.get("apiKey");

  if (apiKey !== process.env.CRON_API_KEY) {
    return unauthorized({ message: "Invalid API Key" });
  }

  const subscriptionController = new SubscriptionController();

  return cors(
    request,
    json<LoaderData>(await subscriptionController.applyStaledSubscriptions())
  );
};

export const ErrorBoundary = ErrorHandler;
