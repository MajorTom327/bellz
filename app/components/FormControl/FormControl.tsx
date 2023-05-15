import React, { useId } from "react";
import { Input } from "react-daisyui";

type Props = {
  type?: "text" | "password" | "email" | "number" | "date" | "time";
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
};

export const FormControl: React.FC<Props> = ({
  type,
  label,
  name,
  required,
  disabled,
}) => {
  const inputId = useId();
  return (
    <>
      <div className="form-control">
        <label className="label" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
        <Input
          id={inputId}
          type={type}
          name={name}
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
