import type { Subscription } from "@prisma/client";
import { Await } from "@remix-run/react";
import type { SerializeFrom } from "@vercel/remix";
import { pathOr } from "ramda";
import React, { Suspense } from "react";
import { Card, Stats } from "react-daisyui";
import CurrencyEnum from "~/refs/CurrencyEnum";

import { MoneyFormat } from "~/components/MoneyFormat";
import { Skeleton } from "~/components/Skeleton";

import { useOptionalUser } from "~/hooks/useUser";

import type { loader } from ".";

type Props = {
  subscriptions: Subscription[];
  incomes: Subscription[];
  totalIncomes: SerializeFrom<typeof loader>["totalIncomes"];
  totalSubscriptions: SerializeFrom<typeof loader>["totalSubscriptions"];
};

const { Stat } = Stats;

export const SubscriptionStats: React.FC<Props> = ({
  subscriptions,
  incomes,
  totalIncomes,
  totalSubscriptions,
}) => {
  const user = useOptionalUser();

  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  return (
    <>
      <Card>
        <Card.Body>
          <Stats className="stats-vertical lg:stats-horizontal">
            <Stats className="stats-vertical">
              <Stats.Stat>
                <Stat.Item variant="title">
                  Number of active subscriptions:
                </Stat.Item>
                <Stat.Item variant="value">{subscriptions.length}</Stat.Item>
              </Stats.Stat>
              <Stats.Stat>
                <Stat.Item variant="title">Number of incomes:</Stat.Item>
                <Stat.Item variant="value">{incomes.length}</Stat.Item>
              </Stats.Stat>
            </Stats>
            <Stats.Stat>
              <Stat.Item variant="title">
                Total amount of subscriptions:
              </Stat.Item>
              <Suspense fallback={<Skeleton />}>
                <Await resolve={totalSubscriptions}>
                  {(totalSubscriptions: number) => (
                    <Stat.Item variant="value">
                      <MoneyFormat
                        value={totalSubscriptions || 0}
                        currency={currency}
                      />
                    </Stat.Item>
                  )}
                </Await>
              </Suspense>
            </Stats.Stat>
            <Stats.Stat>
              <Stat.Item variant="title">Total incomes:</Stat.Item>
              <Stat.Item variant="value">
                <Suspense fallback={<Skeleton />}>
                  <Await resolve={totalIncomes} errorElement={<>ERROR</>}>
                    {(result: number) => (
                      <MoneyFormat value={result || 0} currency={currency} />
                    )}
                  </Await>
                </Suspense>
              </Stat.Item>
            </Stats.Stat>
          </Stats>
        </Card.Body>
      </Card>
    </>
  );
};

SubscriptionStats.defaultProps = {};

export default SubscriptionStats;
