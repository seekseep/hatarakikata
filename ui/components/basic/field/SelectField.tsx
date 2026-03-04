"use client";

import { SelectHTMLAttributes } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

import FieldContainer from "./FieldContainer";
import FieldLabel from "./FieldLabel";

type SelectFieldProps<T extends FieldValues = FieldValues> = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "name"
> & {
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  rules?: RegisterOptions<T>;
};

function SelectField<T extends FieldValues = FieldValues>({
  name,
  label,
  options,
  rules,
  id,
  className,
  ...props
}: SelectFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <FieldContainer className={className}>
      <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
      <select
        id={id ?? name}
        className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        {...props}
        {...register(name, rules as RegisterOptions<T, Path<T>>)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </FieldContainer>
  );
}

export default SelectField;
