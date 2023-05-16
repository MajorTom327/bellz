import React from "react";
import CurrencyEnum from "~/refs/CurrencyEnum";

type Props = {
  value: number;
  currency?: CurrencyEnum;
};

export const formatMoney = (
  amount: number,
  currency: CurrencyEnum = CurrencyEnum.EUR
) => {
  return (amount / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: currency,
  });
};

export const MoneyFormat: React.FC<Props> = ({ value, currency }) => {
  return <>{formatMoney(value, currency)}</>;
};

MoneyFormat.defaultProps = {
  currency: CurrencyEnum.EUR,
};

export default MoneyFormat;
