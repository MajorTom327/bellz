import React, { useEffect, useState } from "react";
import type { ButtonProps } from "react-daisyui";
import { Button } from "react-daisyui";

type Props = ButtonProps & { duration: number };

export const TimedButton: React.FC<Props> = ({
  duration,
  children,
  ...props
}) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDisabled(false);
    }, duration);
    return () => {
      clearTimeout(timeout);
    };
  }, [duration]);
  return (
    <>
      <Button {...props} disabled={isDisabled}>
        {children}
      </Button>
    </>
  );
};

TimedButton.defaultProps = {};

export default TimedButton;
