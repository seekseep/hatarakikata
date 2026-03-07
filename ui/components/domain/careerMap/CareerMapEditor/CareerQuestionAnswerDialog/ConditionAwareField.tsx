"use client"

import { useFormContext, useWatch } from "react-hook-form"

import type { CareerQuestionField } from "@/core/domain"
import CheckboxField from "@/ui/components/basic/field/CheckboxField"
import MonthField from "@/ui/components/basic/field/MonthField"
import RadioField from "@/ui/components/basic/field/RadioField"
import SelectField from "@/ui/components/basic/field/SelectField"
import TextField from "@/ui/components/basic/field/TextField"

import { evaluateCondition } from "./utils"

type ConditionAwareFieldProps = {
  field: CareerQuestionField
}

export default function ConditionAwareField({
  field,
}: ConditionAwareFieldProps) {
  const { control } = useFormContext()
  const values = useWatch({ control })

  if (field.condition && !evaluateCondition(field.condition, values)) {
    return null
  }

  const name = field.name

  switch (field.type) {
    case "text":
      return (
        <TextField
          name={name}
          label={field.label}
          autoFocus={field.autoFocus}
        />
      )
    case "date":
      return (
        <MonthField
          name={name}
          label={field.label}
          autoFocus={field.autoFocus}
        />
      )
    case "number":
      return (
        <TextField
          name={name}
          label={field.label}
          type="number"
          autoFocus={field.autoFocus}
        />
      )
    case "select":
      return (
        <SelectField
          name={name}
          label={field.label}
          options={[
            { value: "", label: "選択してください" },
            ...(field.options?.map((opt) => ({ value: opt, label: opt })) ?? []),
          ]}
          autoFocus={field.autoFocus}
        />
      )
    case "radio":
      return (
        <RadioField
          name={name}
          label={field.label}
          options={field.options?.map((opt) => ({ value: opt, label: opt })) ?? []}
          autoFocus={field.autoFocus}
        />
      )
    case "checkbox":
      return (
        <CheckboxField
          name={name}
          label={field.label}
        />
      )
    case "hidden":
      return null
    default:
      return null
  }
}
