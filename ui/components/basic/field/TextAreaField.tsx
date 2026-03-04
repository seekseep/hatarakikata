"use client";

import { TextareaHTMLAttributes } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

import TextArea from "../input/TextArea";
import FieldContainer from "./FieldContainer";
import FieldLabel from "./FieldLabel";

type TextAreaFieldProps<T extends FieldValues = FieldValues> = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> & {
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T>;
};

function TextAreaField<T extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  id,
  className,
  ...props
}: TextAreaFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name];

  return (
    <FieldContainer className={className}>
      <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
      <TextArea id={id ?? name} {...props} {...register(name, rules as RegisterOptions<T, Path<T>>)} />
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </FieldContainer>
  );
}

export default TextAreaField;
