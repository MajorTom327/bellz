import { Subscription } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { useState } from "react";
import { Button, Card } from "react-daisyui";
import { jsonHash, promiseHash, verifyAuthenticityToken } from "remix-utils";
import zod from "zod";
import OccurenceEnum from "~/refs/OccurenceEnum";
import { getSession } from "~/services.server/session";

import ensureUser from "~/lib/authorization/ensureUser";

import { AccountController } from "~/controllers/AccountController";
import SubscriptionController from "~/controllers/SubscriptionController";

import CreateSubscription from "./CreateSubscription";
import SubscriptionList from "./SubscriptionList";
import SubscriptionStats from "./SubscriptionStats";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);

  const accountController = new AccountController();
  const subscriptionController = new SubscriptionController();

  return json(
    await promiseHash({
      accounts: accountController.getAccountsForUser(user.id),
      subscriptions: subscriptionController.getSubscriptionsForUser(user.id),
    })
  );
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Bellz - Subscription" }];
};

export const AppSubscriptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { subscriptions, accounts } = useLoaderData<typeof loader>();

  const handleOpenCreate = () => setIsOpen(true);
  const handleCloseCreate = () => setIsOpen(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <SubscriptionStats subscriptions={subscriptions} />
        <Card>
          <Card.Body>
            <Card.Title className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl">Subscriptions</h1>
              <Button color="primary" onClick={handleOpenCreate}>
                Create a new subscription
              </Button>
            </Card.Title>
            <SubscriptionList
              subscriptions={subscriptions}
              accounts={accounts}
            />
          </Card.Body>
        </Card>
      </div>

      <CreateSubscription
        open={isOpen}
        onClose={handleCloseCreate}
        accounts={accounts}
      />
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const user = await ensureUser(request);
  await verifyAuthenticityToken(
    request,
    await getSession(request.headers.get("Cookie"))
  );

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  console.log(data);

  const cleanData = zod
    .object({
      name: zod.string(),
      amount: zod.coerce.number().transform((val) => val * 100),
      nextExecution: zod.coerce.date(),
      accountId: zod.string(),
    })
    .parse(data);

  const subscriptionController = new SubscriptionController();

  await subscriptionController.createSubscription(
    cleanData.accountId,
    user.id,
    {
      name: cleanData.name,
      amount: cleanData.amount,
      occurence: OccurenceEnum.MONTHLY,
      nextExecution: cleanData.nextExecution,
    }
  );

  return json({});
};

export default AppSubscriptions;
