import { DateTime } from "luxon";
import React from "react";

type Props = {
  value?: Date | null;
};

export const DateFormat: React.FC<Props> = ({ value }) => {
  // @ts-ignore
  const date = DateTime.fromISO(value);

  if (date.isValid) {
    return <>{date.toLocaleString(DateTime.DATE_MED)}</>;
  }
  return null;
};

DateFormat.defaultProps = {};

export default DateFormat;
