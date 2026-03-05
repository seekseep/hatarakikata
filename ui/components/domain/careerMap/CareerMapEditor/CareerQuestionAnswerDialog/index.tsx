"use client"

import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

import type { CareerQuestion } from "@/core/domain"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import { useAnswerQuestionMutation } from "@/ui/hooks/careerQuestion"

import { addEvent } from "../../actions/eventActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ConditionAwareField from "./ConditionAwareField"

type CareerQuestionAnswerDialogProps = {
  open: boolean
  question: CareerQuestion | null
  onClose: () => void
}

export default function CareerQuestionAnswerDialog({
  open,
  question,
  onClose,
}: CareerQuestionAnswerDialogProps) {
  const { dispatch } = useCarrerMapEditorContext()
  const answerMutation = useAnswerQuestionMutation()

  const methods = useForm()
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (question) {
      const defaults: Record<string, unknown> = {}
      for (const field of question.fields) {
        if (field.default !== undefined) {
          let value = field.default
          if (field.type === "date" && typeof value === "string") {
            value = value.slice(0, 7)
          }
          defaults[field.name] = value
        }
      }
      reset(defaults)
    }
  }, [question, reset])

  const onSubmit = handleSubmit((data) => {
    if (!question) return

    answerMutation.mutate(
      { id: question.id, answer: data },
      {
        onSuccess: (event) => {
          dispatch(addEvent(event))
          onClose()
        },
      },
    )
  })

  return (
    <Dialog open={open} onClose={onClose} className="w-full max-w-md">
      {question && (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">回答する</h3>

          <FormProvider {...methods}>
            {question.fields.map((field, i) => (
              <ConditionAwareField
                key={i}
                field={field}
              />
            ))}
          </FormProvider>

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
              {answerMutation.isPending ? "回答中..." : "回答する"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
