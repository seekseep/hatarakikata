"use client"

import { InputHTMLAttributes } from "react"
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form"

import FieldContainer from "./FieldContainer"
import FieldLabel from "./FieldLabel"

type MonthFieldProps<T extends FieldValues = FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  name: Path<T>
  label: string
  rules?: RegisterOptions<T>
}

function MonthField<T extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  id,
  className,
  ...props
}: MonthFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>()
  const error = errors[name]

  return (
    <FieldContainer className={className}>
      <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
      <input
        type="month"
        id={id ?? name}
        className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
        {...props}
        {...register(name, rules as RegisterOptions<T, Path<T>>)}
      />
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </FieldContainer>
  )
}

export default MonthField
