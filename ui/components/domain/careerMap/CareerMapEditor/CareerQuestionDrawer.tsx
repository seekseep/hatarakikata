"use client"

import { useEffect, useState } from "react"
import { RxCross2 } from "react-icons/rx"

import type { CareerQuestion } from "@/core/domain"
import Spinner from "@/ui/components/basic/Spinner"
import {
  useCareerQuestionsQuery,
  useCloseQuestionMutation,
  useInitializeQuestionsMutation,
} from "@/ui/hooks/careerQuestion"

import CareerQuestionAnswerDialog from "./CareerQuestionAnswerDialog"

const QUESTION_NAME_LABELS: Record<string, string> = {
  elementary_school: "小学校",
  middle_school: "中学校",
  high_school: "高校",
  university: "大学・専門学校",
}

type CareerQuestionDrawerProps = {
  onClose: () => void
}

export default function CareerQuestionDrawer({ onClose }: CareerQuestionDrawerProps) {
  const questionsQuery = useCareerQuestionsQuery()
  const initMutation = useInitializeQuestionsMutation()
  const closeMutation = useCloseQuestionMutation()
  const [selectedQuestion, setSelectedQuestion] = useState<CareerQuestion | null>(null)

  // 404 → auto-initialize
  const is404 =
    questionsQuery.error &&
    "status" in questionsQuery.error &&
    (questionsQuery.error as { status: number }).status === 404

  useEffect(() => {
    if (is404 && !initMutation.isPending) {
      initMutation.mutate()
    }
  }, [is404]) // eslint-disable-line react-hooks/exhaustive-deps

  const questions = questionsQuery.data ?? []
  const openQuestions = questions.filter((q) => q.status === "open")

  const isLoading = questionsQuery.isLoading || initMutation.isPending

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
            aria-label="閉じる"
          >
            <RxCross2 size={20} />
          </button>
          <h2 className="text-lg font-bold">質問</h2>
          <div className="w-7" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : openQuestions.length === 0 ? (
            <p className="text-sm text-foreground/50 text-center py-12">
              未回答の質問はありません
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {openQuestions.map((q) => (
                <li key={q.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 text-left rounded-lg border border-foreground/10 px-4 py-3 hover:bg-foreground/5 transition-colors"
                    onClick={() => setSelectedQuestion(q)}
                  >
                    <span className="text-sm font-medium">
                      {QUESTION_NAME_LABELS[q.name] ?? q.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-1.5 hover:bg-foreground/10 transition-colors text-foreground/40 hover:text-foreground/70"
                    aria-label="質問を閉じる"
                    disabled={closeMutation.isPending}
                    onClick={() => closeMutation.mutate(q.id)}
                  >
                    <RxCross2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CareerQuestionAnswerDialog
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />
    </>
  )
}
