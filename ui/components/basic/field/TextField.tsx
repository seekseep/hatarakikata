"use client";

import { InputHTMLAttributes } from "react";
import { FieldValues, Path,RegisterOptions, useFormContext } from "react-hook-form";

import Input from "../input/Input";
import FieldContainer from "./FieldContainer";
import FieldLabel from "./FieldLabel";

type TextFieldProps<T extends FieldValues = FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> & {
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T>;
};

function TextField<T extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  id,
  className,
  ...props
}: TextFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <FieldContainer className={className}>
      <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
      <Input id={id ?? name} {...props} {...register(name, rules as RegisterOptions<T, Path<T>>)} />
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </FieldContainer>
  );
}

export default TextField;
