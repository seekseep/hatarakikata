"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"

import type { CareerQuestion, CareerQuestionField, CareerQuestionFieldCondition } from "@/core/domain"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import { useAnswerQuestionMutation } from "@/ui/hooks/careerQuestion"

import { addEvent } from "../actions/eventActions"
import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"

type CareerQuestionAnswerDialogProps = {
  question: CareerQuestion | null
  onClose: () => void
}

function evaluateCondition(
  condition: CareerQuestionFieldCondition,
  values: Record<string, unknown>,
): boolean {
  const matchExpr = (expr: { name: string; value: unknown }) =>
    values[expr.name] === expr.value

  const andOk = !condition.and || condition.and.every(matchExpr)
  const orOk = !condition.or || condition.or.some(matchExpr)

  return andOk && orOk
}

function ConditionAwareField({
  field,
  register,
  control,
}: {
  field: CareerQuestionField
  register: ReturnType<typeof useForm>["register"]
  control: ReturnType<typeof useForm>["control"]
}) {
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

export default function CareerQuestionAnswerDialog({
  question,
  onClose,
}: CareerQuestionAnswerDialogProps) {
  const { dispatch } = useCarrerMapEditorContext()
  const answerMutation = useAnswerQuestionMutation()

  const { register, handleSubmit, reset, control } = useForm()

  useEffect(() => {
    if (question) {
      reset({})
    }
  }, [question, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!question) return

    try {
      const event = await answerMutation.mutateAsync({
        id: question.id,
        answer: data,
      })
      dispatch(addEvent(event))
      onClose()
    } catch {
      // error is handled by mutation state
    }
  })

  return (
    <Dialog open={!!question} onClose={onClose} className="w-full max-w-md">
      {question && (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">回答する</h3>

          {question.fields.map((field, i) => (
            <ConditionAwareField
              key={i}
              field={field}
              register={register}
              control={control}
            />
          ))}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" size="medium" onClick={onClose}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={answerMutation.isPending}
            >
              {answerMutation.isPending ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
