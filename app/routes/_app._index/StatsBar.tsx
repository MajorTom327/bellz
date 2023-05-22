import type { Account } from "@prisma/client";
import { Await } from "@remix-run/react";
import { pathOr } from "ramda";
import React, { Suspense } from "react";
import { Card, Progress, Stats } from "react-daisyui";
import CurrencyEnum from "~/refs/CurrencyEnum";

import MoneyFormat from "~/components/MoneyFormat";
import { PercentFormat } from "~/components/PercentFormat";
import { Skeleton } from "~/components/Skeleton";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {
  accounts: Account[];
  totalBalance: Promise<number> | number;
};

const Stat = Stats.Stat;

export const StatsBar: React.FC<Props> = ({ accounts, totalBalance }) => {
  const user = useOptionalUser();
  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  const objective = pathOr(0, ["profile", "objective"], user);

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
                  <Suspense fallback={<Skeleton className="h-8" rounded />}>
                    <Await resolve={totalBalance}>
                      {(totalBalance) => (
                        <MoneyFormat value={totalBalance} currency={currency} />
                      )}
                    </Await>
                  </Suspense>
                </Stat.Item>
                {/* <Stat.Item variant="desc">21% more than last month</Stat.Item> */}
              </Stats.Stat>
              <Stats.Stat>
                <Stat.Item variant="title">Current objective:</Stat.Item>
                <Suspense
                  fallback={
                    <div className="flex flex-col py-2">
                      <Skeleton className=" h-8" rounded />
                      <Skeleton className="w-full h-2" rounded />
                      <div className="flex justify-center">
                        <Skeleton className="w-16 h-2" rounded />
                      </div>
                    </div>
                  }
                >
                  <Await resolve={totalBalance}>
                    {(totalBalance) => (
                      <>
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
                            <PercentFormat
                              value={(totalBalance || 0) / objective}
                            />
                          </div>
                        </Stat.Item>
                      </>
                    )}
                  </Await>
                </Suspense>
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
