import type { Subscription } from "@prisma/client";
import { pathOr } from "ramda";
import React from "react";
import { Card, Stats } from "react-daisyui";
import CurrencyEnum from "~/refs/CurrencyEnum";

import { MoneyFormat } from "~/components/MoneyFormat";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {
  subscriptions: Subscription[];
  totalBalance: number;
};

const { Stat } = Stats;

export const SubscriptionStats: React.FC<Props> = ({
  subscriptions,
  totalBalance,
}) => {
  const user = useOptionalUser();

  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  return (
    <>
      <Card>
        <Card.Body>
          <Stats className="stats-vertical lg:stats-horizontal">
            <Stats.Stat>
              <Stat.Item variant="title">
                Number of active subscriptions:
              </Stat.Item>
              <Stat.Item variant="value">{subscriptions.length}</Stat.Item>
            </Stats.Stat>
            <Stats.Stat>
              <Stat.Item variant="title">
                Total amount of subscriptions:
              </Stat.Item>
              <Stat.Item variant="value">
                <MoneyFormat value={totalBalance} currency={currency} />
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
