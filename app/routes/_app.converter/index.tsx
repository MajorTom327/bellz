import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { json } from "@vercel/remix";
import { pathOr, values } from "ramda";
import { useReducer } from "react";
import { Button, Card, Input, InputGroup, Select } from "react-daisyui";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { match } from "ts-pattern";
import CurrencyEnum from "~/refs/CurrencyEnum";

import { useOptionalUser } from "~/hooks/useUser";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

type ReducerState = {
  fromValue: number;
  fromCurrency: CurrencyEnum;
  toValue: number;
  toCurrency: CurrencyEnum;
};

type ReducerAction =
  | { type: "swap" }
  | { type: "selectFrom"; currency: CurrencyEnum }
  | { type: "selectTo"; currency: CurrencyEnum }
  | { type: "changeFromValue"; value: number };

export const AppConverter = () => {
  const user = useOptionalUser();
  const defaultCurrency = pathOr(
    CurrencyEnum.EUR,
    ["profile", "currency"],
    user
  );

  const fetcher = useFetcher();

  const [currentState, dispatchState] = useReducer(
    (state: ReducerState, action: ReducerAction): ReducerState => {
      return match(action)
        .with({ type: "swap" }, () => {
          return {
            fromValue: state.toValue,
            fromCurrency: state.toCurrency,
            toValue: state.fromValue,
            toCurrency: state.fromCurrency,
          };
        })
        .with({ type: "selectFrom" }, ({ currency }) => {
          return {
            ...state,
            fromCurrency: currency,
          };
        })
        .with({ type: "selectTo" }, ({ currency }) => {
          return {
            ...state,
            toCurrency: currency,
          };
        })
        .with({ type: "changeFromValue" }, ({ value }) => {
          return {
            ...state,
            fromValue: value,
          };
        })
        .otherwise(() => state);
    },
    {
      fromValue: 0,
      fromCurrency:
        values(CurrencyEnum).find((el: string) => el !== defaultCurrency) ||
        (defaultCurrency as CurrencyEnum),
      toValue: 0,
      toCurrency: defaultCurrency as CurrencyEnum,
    }
  );

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h1 className="text-2xl">Converter</h1>
          </Card.Title>
          <div className="flex gap-2">
            <InputGroup className="w-full">
              <Input
                bordered
                className="w-full"
                type="number"
                value={currentState.fromValue}
                onChange={(e) => {
                  dispatchState({
                    type: "changeFromValue",
                    value: parseFloat(e.target.value),
                  });
                }}
              />
              <Select
                value={currentState.fromCurrency}
                onChange={(e) => {
                  dispatchState({
                    type: "selectFrom",
                    currency: e.target.value as CurrencyEnum,
                  });
                }}
              >
                {Object.values(CurrencyEnum).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
            </InputGroup>
            <Button
              color="ghost"
              className="text-xl"
              onClick={() => dispatchState({ type: "swap" })}
            >
              <HiOutlineSwitchHorizontal />
            </Button>
            <InputGroup className="w-full">
              <Input
                bordered
                className="w-full"
                type="number"
                value={currentState.toValue}
                disabled
              />
              <Select value={currentState.toCurrency}>
                {Object.values(CurrencyEnum).map((currency) => (
                  <option value={currency}>{currency}</option>
                ))}
              </Select>
            </InputGroup>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export default AppConverter;
