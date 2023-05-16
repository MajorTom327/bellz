import React, { useId } from "react";
import type { SelectProps } from "react-daisyui";
import { Select } from "react-daisyui";

type Props = SelectProps & {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
};

export const SelectControl: React.FC<Props> = ({
  label,
  name,
  required,
  disabled,
  children,
  ...props
}) => {
  const inputId = useId();
  return (
    <>
      <div className="form-control">
        <label className="label" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
        <Select
          {...props}
          id={inputId}
          name={name}
          required={required}
          placeholder={label}
          disabled={disabled}
        >
          {children}
        </Select>
      </div>
    </>
  );
};

SelectControl.defaultProps = {};

export default SelectControl;
