import { defaultTo } from "ramda";
import React from "react";
import { Select } from "react-daisyui";
import CurrencyEnum from "~/refs/CurrencyEnum";

import SelectControl from "./SelectControl";

type Props = {
  name?: string;
  defaultValue?: CurrencyEnum;
};

export const CurrencySelector: React.FC<Props> = ({ defaultValue, name }) => {
  return (
    <>
      <SelectControl
        label="Currency"
        name={defaultTo("currency", name)}
        defaultValue={defaultValue}
      >
        {Object.entries(CurrencyEnum).map(([key, value]) => (
          <Select.Option key={key} value={value}>
            {value}
          </Select.Option>
        ))}
      </SelectControl>
    </>
  );
};

CurrencySelector.defaultProps = {
  name: "currency",
};

export default CurrencySelector;
