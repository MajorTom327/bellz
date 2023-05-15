import React, { useMemo } from "react";
import { Card, Progress, Stats } from "react-daisyui";

import type Account from "~/models/Account";

import MoneyFormat from "~/components/MoneyFormat";
import { PercentFormat } from "~/components/PercentFormat";

type Props = {
  accounts: Account[];
};

const Stat = Stats.Stat;

export const StatsBar: React.FC<Props> = ({ accounts }) => {
  const totalAmount: number = useMemo(() => {
    return accounts.reduce((acc: number, account: Account) => {
      return acc + account.balance;
    }, 0);
  }, [accounts]);

  const objective = 10_000_00;

  const objective_percent = useMemo(() => {
    return (totalAmount || 0) / objective;
  }, [totalAmount]);

  return (
    <>
      <div className="w-full">
        <Card>
          <Card.Body>
            <Stats>
              <Stats.Stat>
                <Stat.Item variant="title">Number of active account:</Stat.Item>
                <Stat.Item variant="value">{accounts.length}</Stat.Item>
              </Stats.Stat>
              <Stats.Stat>
                <Stat.Item variant="title">Total Balance:</Stat.Item>
                <Stat.Item variant="value">
                  <MoneyFormat value={totalAmount} />
                </Stat.Item>
                <Stat.Item variant="desc">21% more than last month</Stat.Item>
              </Stats.Stat>
              <Stats.Stat>
                <Stat.Item variant="title">Current objective:</Stat.Item>
                <Stat.Item variant="value">
                  <MoneyFormat value={objective} />
                </Stat.Item>
                <Stat.Item variant="desc">
                  <div className="flex flex-col gap-1 items-center">
                    <Progress
                      color="accent"
                      value={totalAmount}
                      max={objective}
                    />
                    <PercentFormat value={objective_percent} />
                  </div>
                </Stat.Item>
              </Stats.Stat>
            </Stats>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

StatsBar.defaultProps = {};

export default StatsBar;
