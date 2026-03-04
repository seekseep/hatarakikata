"use client"

import { InputHTMLAttributes } from "react"
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form"

import FieldContainer from "./FieldContainer"

type CheckboxFieldProps<T extends FieldValues = FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  name: Path<T>
  label: string
  rules?: RegisterOptions<T>
}

function CheckboxField<T extends FieldValues = FieldValues>({
  name,
  label,
  rules,
  className,
  ...props
}: CheckboxFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>()
  const error = errors[name]

  return (
    <FieldContainer className={className}>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-foreground/20 text-primary focus:ring-primary"
          {...props}
          {...register(name, rules as RegisterOptions<T, Path<T>>)}
        />
        {label}
      </label>
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </FieldContainer>
  )
}

export default CheckboxField
