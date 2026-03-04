"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import type { CareerQuestion } from "@/core/domain"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import { useAnswerQuestionMutation } from "@/ui/hooks/careerQuestion"

import { addEvent } from "../../actions/eventActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ConditionAwareField from "./ConditionAwareField"

type CareerQuestionAnswerDialogProps = {
  question: CareerQuestion | null
  onClose: () => void
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
