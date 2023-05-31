import { pathOr } from "ramda";
import React from "react";
import { Card, Stats } from "react-daisyui";
import CurrencyEnum from "~/refs/CurrencyEnum";

import { MoneyFormat } from "~/components/MoneyFormat";

import { useOptionalUser } from "~/hooks/useUser";

const Stat = Stats.Stat;

type Props = {
  summary: {
    total: number;
    refunded: number;
  };
};

export const LoanStats: React.FC<Props> = ({ summary }) => {
  const user = useOptionalUser();

  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  return (
    <>
      <Card>
        <Card.Body>
          <Stats>
            <Stat>
              <Stat.Item variant="title">Total</Stat.Item>
              <Stat.Item variant="value">
                <MoneyFormat value={summary.total} currency={currency} />
              </Stat.Item>
            </Stat>
            <Stat>
              <Stat.Item variant="title">Total Refunded</Stat.Item>
              <Stat.Item variant="value">
                <MoneyFormat value={summary.refunded} currency={currency} />
              </Stat.Item>
            </Stat>
          </Stats>
        </Card.Body>
      </Card>
    </>
  );
};

LoanStats.defaultProps = {};

export default LoanStats;
