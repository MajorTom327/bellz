import type { Subscription } from "@prisma/client";
import React from "react";
import { Card, Stats } from "react-daisyui";

import { MoneyFormat } from "~/components/MoneyFormat";

type Props = {
  subscriptions: Subscription[];
};

const { Stat } = Stats;

export const SubscriptionStats: React.FC<Props> = ({ subscriptions }) => {
  const totalAmount = subscriptions.reduce((red, el) => red + el.amount, 0);

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
                <MoneyFormat value={totalAmount} />
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
