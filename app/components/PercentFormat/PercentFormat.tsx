import React from "react";

type Props = {
  value: number;
};

export const formatPercent = (amount: number) => {
  return amount.toLocaleString("fr-FR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const PercentFormat: React.FC<Props> = ({ value }) => {
  return <>{formatPercent(value)}</>;
};

PercentFormat.defaultProps = {};

export default PercentFormat;
