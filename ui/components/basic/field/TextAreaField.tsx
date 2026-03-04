"use client";

import clsx from "clsx";
import { TextareaHTMLAttributes } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

import TextArea from "../input/TextArea";

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
    <div className={clsx("flex flex-col gap-1", className)}>
      <label htmlFor={id ?? name} className="text-sm font-medium">
        {label}
      </label>
      <TextArea id={id ?? name} {...props} {...register(name, rules as RegisterOptions<T, Path<T>>)} />
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </div>
  );
}

export default TextAreaField;
