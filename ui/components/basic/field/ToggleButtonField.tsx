"use client"

import clsx from "clsx"
import { FieldValues, Path, RegisterOptions, useFormContext, useWatch } from "react-hook-form"

type Option = {
  value: string
  label: string
  color?: string
}

type ToggleButtonFieldProps<T extends FieldValues = FieldValues> = {
  name: Path<T>
  label: string
  options: Option[]
  rules?: RegisterOptions<T>
  className?: string
}

function ToggleButtonField<T extends FieldValues = FieldValues>({
  name,
  label,
  options,
  rules,
  className,
}: ToggleButtonFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>()
  const selected = useWatch<T>({ name })
  const error = errors[name]

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={clsx(
              "flex-1 cursor-pointer rounded-md border-2 px-3 py-2 text-center text-sm font-medium transition-colors",
              option.color
                ? `${option.color} ${selected === option.value ? "ring-2 ring-offset-1" : "opacity-50"}`
                : selected === option.value
                  ? "bg-primary-500 text-white border-primary-500 hover:bg-primary-600"
                  : "bg-transparent text-foreground/70 border-foreground/20 hover:bg-foreground/5"
            )}
          >
            <input
              type="radio"
              value={option.value}
              className="sr-only"
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

export default ToggleButtonField
