"use client"

import clsx from "clsx"
import { InputHTMLAttributes } from "react"
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form"

type RadioFieldProps<T extends FieldValues = FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  name: Path<T>
  label: string
  options: { value: string; label: string }[]
  rules?: RegisterOptions<T>
}

function RadioField<T extends FieldValues = FieldValues>({
  name,
  label,
  options,
  rules,
  className,
  ...props
}: RadioFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>()
  const error = errors[name]

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              value={option.value}
              className="accent-primary-500"
              {...props}
              {...register(name, rules as RegisterOptions<T, Path<T>>)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </div>
  )
}

export default RadioField
