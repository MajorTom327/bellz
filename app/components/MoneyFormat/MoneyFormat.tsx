import React from "react";

type Props = {
  value: number;
};

export const formatMoney = (amount: number) => {
  return (amount / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
};

export const MoneyFormat: React.FC<Props> = ({ value }) => {
  return <>{formatMoney(value)}</>;
};

MoneyFormat.defaultProps = {};

export default MoneyFormat;
