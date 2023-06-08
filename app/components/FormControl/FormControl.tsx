import React, { useId } from "react";
import type { InputProps } from "react-daisyui";
import { Input } from "react-daisyui";

type Props = InputProps & {
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "date"
    | "time"
    | "datetime-local";
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
};

export const FormControl: React.FC<Props> = ({
  type,
  label,
  name,
  required,
  disabled,
  ...props
}) => {
  const inputId = useId();
  return (
    <>
      <div className="form-control">
        <label className="label" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
        <Input
          {...props}
          id={inputId}
          type={type}
          name={name}
          step={type === "number" ? "0.01" : undefined}
          required={required}
          placeholder={label}
          disabled={disabled}
        />
      </div>
    </>
  );
};

FormControl.defaultProps = {
  type: "text",
};

export default FormControl;
