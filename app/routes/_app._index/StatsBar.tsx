import type { Account } from "@prisma/client";
import Bluebird from "bluebird";
import { pathOr } from "ramda";
import React, { Suspense, useMemo, useState } from "react";
import { useEffect } from "react";
import { Card, Progress, Stats } from "react-daisyui";
import CurrencyEnum from "~/refs/CurrencyEnum";

import FinanceApi from "~/lib/finance";

import MoneyFormat from "~/components/MoneyFormat";
import { PercentFormat } from "~/components/PercentFormat";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {
  accounts: Account[];
  totalBalance: number;
};

const Stat = Stats.Stat;

export const StatsBar: React.FC<Props> = ({ accounts, totalBalance }) => {
  const user = useOptionalUser();
  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  const objective = pathOr(0, ["profile", "objective"], user);

  const objective_percent = useMemo(() => {
    return (totalBalance || 0) / objective;
  }, [totalBalance, objective]);

  return (
    <>
      <div className="w-full">
        <Card>
          <Card.Body>
            <Stats className="stats-vertical lg:stats-horizontal">
              <Stats.Stat>
                <Stat.Item variant="title">Number of active account:</Stat.Item>
                <Stat.Item variant="value">{accounts.length}</Stat.Item>
              </Stats.Stat>
              <Stats.Stat>
                <Stat.Item variant="title">Total Balance:</Stat.Item>
                <Stat.Item variant="value">
                  <MoneyFormat value={totalBalance} currency={currency} />
                </Stat.Item>
                <Stat.Item variant="desc">21% more than last month</Stat.Item>
              </Stats.Stat>
              <Stats.Stat>
                <Stat.Item variant="title">Current objective:</Stat.Item>
                <Stat.Item variant="value">
                  <MoneyFormat value={objective} currency={currency} />
                </Stat.Item>
                <Stat.Item variant="desc">
                  <div className="flex flex-col gap-1 items-center">
                    <Progress
                      color="accent"
                      value={totalBalance}
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
