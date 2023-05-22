import type { Subscription } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
// import { defer, json } from "@vercel/remix";
import { defer, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Bluebird from "bluebird";
import { DateTime } from "luxon";
import { identity, multiply, omit, pathOr, pick } from "ramda";
import { useState } from "react";
import { Button, Card } from "react-daisyui";
import { verifyAuthenticityToken } from "remix-utils";
import { P, match } from "ts-pattern";
import zod from "zod";
import CurrencyEnum from "~/refs/CurrencyEnum";
import OccurenceEnum from "~/refs/OccurenceEnum";
import { getSession } from "~/services.server/session";

import ensureUser from "~/lib/authorization/ensureUser";
import FinanceApi from "~/lib/finance";

import { AccountController } from "~/controllers/AccountController";
import SubscriptionController from "~/controllers/SubscriptionController";

import ErrorHandler from "~/components/ErrorHandler";

import CreateSubscription from "./CreateSubscription";
import SubscriptionList from "./SubscriptionList";
import SubscriptionStats from "./SubscriptionStats";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);
  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  const accountController = new AccountController();
  const subscriptionController = new SubscriptionController();

  const recurrentTransactions =
    await subscriptionController.getSubscriptionsForUser(user.id);

  const subscriptions = recurrentTransactions.filter((transaction) => {
    return transaction.amount < 0;
  });

  const incomes = recurrentTransactions.filter((transaction) => {
    return transaction.amount > 0;
  });

  const financeApi = new FinanceApi();

  const getTotalBalance = (subscriptions: Subscription[]): Promise<number> => {
    return new Promise((resolve) => {
      const daysInMonth = DateTime.local().daysInMonth || 30;
      const weeksInMonth = Math.ceil(daysInMonth / 7);

      return Bluebird.reduce(
        subscriptions,
        async (acc: number, subscription) => {
          const toCurrency = pathOr(
            CurrencyEnum.EUR,
            ["account", "currency"],
            subscription
          );
          const amount = match(pick(["occurence", "amount"], subscription))
            .with(
              { occurence: OccurenceEnum.MONTHLY, amount: P.select() },
              identity
            )
            .with(
              { occurence: OccurenceEnum.WEEKLY, amount: P.select() },
              multiply(weeksInMonth)
            )
            .with(
              { occurence: OccurenceEnum.DAILY, amount: P.select() },
              multiply(daysInMonth)
            )
            .otherwise(() => 0);

          if (toCurrency === currency) {
            return acc + amount;
          }

          const rate = await financeApi.getExchangeRate(
            toCurrency as CurrencyEnum,
            currency
          );

          return acc + amount * rate;
        },
        0
      ).then((total) => {
        return resolve(total);
      });
    });
  };

  return defer({
    accounts: await accountController.getAccountsForUser(user.id),
    subscriptions: subscriptions,
    incomes: incomes,
    totalSubscriptions: getTotalBalance(subscriptions),
    totalIncomes: getTotalBalance(incomes),
  });
};

export const meta: V2_MetaFunction = () => {
  return [{ title: "Bellz - Subscription" }];
};

export const AppSubscriptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { subscriptions, incomes, accounts, totalIncomes, totalSubscriptions } =
    useLoaderData<typeof loader>();

  const handleOpenCreate = () => setIsOpen(true);
  const handleCloseCreate = () => setIsOpen(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <SubscriptionStats
          subscriptions={subscriptions}
          incomes={incomes}
          totalIncomes={totalIncomes}
          totalSubscriptions={totalSubscriptions}
        />
        <Card>
          <Card.Body>
            <Card.Title className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl">Subscriptions</h1>
              <Button color="primary" onClick={handleOpenCreate}>
                Create a new subscription
              </Button>
            </Card.Title>
            <SubscriptionList
              subscriptions={[...subscriptions, ...incomes]}
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

  const cleanData = zod
    .object({
      name: zod.string(),
      isSubscription: zod.coerce.boolean(),
      amount: zod.coerce.number().transform((val) => val * 100),
      occurence: zod.nativeEnum(OccurenceEnum),
      nextExecution: zod.coerce.date(),
      accountId: zod.string(),
    })
    .transform((data) => {
      return omit(["isSubscription"], {
        ...data,
        amount: data.amount * (data.isSubscription ? -1 : 1),
      });
    })
    .parse(data);

  const subscriptionController = new SubscriptionController();

  await subscriptionController.createSubscription(
    cleanData.accountId,
    user.id,
    {
      name: cleanData.name,
      amount: cleanData.amount,
      occurence: cleanData.occurence,
      nextExecution: cleanData.nextExecution,
    }
  );

  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default AppSubscriptions;
