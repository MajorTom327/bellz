import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { json } from "@vercel/remix";
import { useDebounce, useDebounceEffect } from "ahooks";
import { pathOr, values } from "ramda";
import { useEffect, useReducer } from "react";
import { Button, Card, Input, InputGroup, Select } from "react-daisyui";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { match } from "ts-pattern";
import zod from "zod";
import CurrencyEnum from "~/refs/CurrencyEnum";

import FinanceApi from "~/lib/finance";

import { useOptionalUser } from "~/hooks/useUser";

type LoaderData = {};
type ActionData = {
  rate: number;
  from: CurrencyEnum;
  to: CurrencyEnum;
  value: number;
};

const finance = new FinanceApi();

export const loader: LoaderFunction = async ({ request }) => {
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
  | { type: "changeFromValue"; value: number }
  | { type: "changeToValue"; value: number };

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
        .with({ type: "changeToValue" }, ({ value }) => {
          return {
            ...state,
            toValue: value,
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

  useDebounceEffect(
    () => {
      if (currentState.fromValue === 0) {
        return;
      }

      fetcher.submit(
        {
          from: currentState.fromCurrency,
          to: currentState.toCurrency,
          value: currentState.fromValue.toString(),
        },
        { method: "POST" }
      );
    },
    [
      currentState.fromCurrency,
      currentState.fromValue,
      currentState.toCurrency,
    ],
    { wait: 500 }
  );

  useEffect(() => {
    if (fetcher.data?.value === undefined) {
      return;
    }

    // Cleanup the value
    const value = Math.round(pathOr(0, ["data", "value"], fetcher) * 100) / 100;

    dispatchState({
      type: "changeToValue",
      value,
    });
  }, [fetcher.data?.value]);

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
                readOnly
                disabled
              />
              <Select
                value={currentState.toCurrency}
                onChange={(e) =>
                  dispatchState({
                    type: "selectTo",
                    currency: e.target.value as CurrencyEnum,
                  })
                }
              >
                {Object.values(CurrencyEnum).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
            </InputGroup>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const params = zod
    .object({
      from: zod.nativeEnum(CurrencyEnum),
      to: zod.nativeEnum(CurrencyEnum),
      value: zod.coerce.number(),
    })
    .parse(Object.fromEntries(formData.entries()));

  const rate = await finance.getExchangeRate(params.from, params.to);

  console.log("Rate", { rate, params });

  return json<ActionData>({
    rate,
    from: params.from,
    to: params.to,
    value: params.value * rate,
  });
};

export default AppConverter;
