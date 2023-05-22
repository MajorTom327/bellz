import classNames from "classnames";
import { not } from "ramda";
import React, { useEffect, useState } from "react";
import { Toggle } from "react-daisyui";

type Props = {};

enum SubscriptionType {
  Income = "income",
  Subscription = "subscription",
}

export const SubscriptionTypeInput: React.FC<Props> = ({}) => {
  const [toggleChecked, setToggleChecked] = useState(false);

  const isSubscription = toggleChecked === true;
  const isIncome = toggleChecked === false;

  return (
    <>
      <div className="grid grid-cols-3 items-center justify-center text-center">
        <button
          type="button"
          onClick={() => setToggleChecked(false)}
          className={classNames("transition-all", {
            "text-primary font-semibold text-lg": isIncome,
            "text-slate-400": isSubscription,
          })}
        >
          Income
        </button>
        <div>
          <Toggle
            name="isSubscription"
            size="lg"
            checked={toggleChecked}
            onChange={() => setToggleChecked(not)}
          />
        </div>
        <button
          type="button"
          onClick={() => setToggleChecked(true)}
          className={classNames("transition-all", {
            "text-primary font-semibold text-lg": isSubscription,
            "text-slate-400": isIncome,
          })}
        >
          Subscription
        </button>
      </div>
    </>
  );
};

SubscriptionTypeInput.defaultProps = {};

export default SubscriptionTypeInput;
