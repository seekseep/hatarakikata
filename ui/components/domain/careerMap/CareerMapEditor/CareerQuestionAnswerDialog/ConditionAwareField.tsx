"use client"

import { useForm, useWatch } from "react-hook-form"

import type { CareerQuestionField } from "@/core/domain"

import { evaluateCondition } from "./utils"

type ConditionAwareFieldProps = {
  field: CareerQuestionField
  register: ReturnType<typeof useForm>["register"]
  control: ReturnType<typeof useForm>["control"]
}

export default function ConditionAwareField({
  field,
  register,
  control,
}: ConditionAwareFieldProps) {
  const values = useWatch({ control })

  if (field.condition && !evaluateCondition(field.condition, values)) {
    return null
  }

  const name = field.name

  switch (field.type) {
    case "text":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type="text"
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register(name)}
          />
        </div>
      )
    case "date":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type="month"
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register(name)}
          />
        </div>
      )
    case "number":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type="number"
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register(name)}
          />
        </div>
      )
    case "select":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>
          <select
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register(name)}
          >
            <option value="">選択してください</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )
    case "radio":
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{field.label}</span>
          <div className="flex gap-3">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  value={opt}
                  {...register(name)}
                  className="accent-primary-500"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            {...register(name)}
            className="rounded accent-primary-500"
          />
          {field.label}
        </label>
      )
    default:
      return null
  }
}
