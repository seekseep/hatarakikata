"use client";

import clsx from "clsx";
import { SelectHTMLAttributes } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

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
    <div className={clsx("flex flex-col gap-1", className)}>
      <label htmlFor={id ?? name} className="text-sm font-medium">
        {label}
      </label>
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
    </div>
  );
}

export default SelectField;
