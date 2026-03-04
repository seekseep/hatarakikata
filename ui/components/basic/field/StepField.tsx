"use client"

import { InputHTMLAttributes } from "react"
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form"

import FieldContainer from "./FieldContainer"
import FieldLabel from "./FieldLabel"

type StepFieldProps<T extends FieldValues = FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  name: Path<T>
  label: string
  min: number
  max: number
  step?: number
  rules?: RegisterOptions<T>
}

function StepField<T extends FieldValues = FieldValues>({
  name,
  label,
  min,
  max,
  step = 1,
  rules,
  id,
  className,
  ...props
}: StepFieldProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>()
  const error = errors[name]
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <FieldContainer className={className}>
      <FieldLabel htmlFor={id ?? name}>{label}</FieldLabel>
      <input
        type="range"
        id={id ?? name}
        min={min}
        max={max}
        step={step}
        className="w-full"
        {...props}
        {...register(name, rules as RegisterOptions<T, Path<T>>)}
      />
      <div className="flex justify-between text-xs text-foreground/50">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error.message as string}</p>}
    </FieldContainer>
  )
}

export default StepField
