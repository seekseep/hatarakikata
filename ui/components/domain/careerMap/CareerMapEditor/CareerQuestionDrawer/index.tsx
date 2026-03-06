"use client"

import { useState } from "react"
import { RiCloseLine } from "react-icons/ri"

import type { CareerQuestion } from "@/core/domain"
import Drawer from "@/ui/components/basic/Drawer"

import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import CareerQuestionAnswerDialog from "../CareerQuestionAnswerDialog"
import CareerQuestionItem from "./CareerQuestionItem"

type CareerQuestionDrawerProps = {
  open: boolean
  onClose: () => void
}

export default function CareerQuestionDrawer({ open, onClose }: CareerQuestionDrawerProps) {
  const { state: { questions } } = useCarrerMapEditorContext()
  const [selectedQuestion, setSelectedQuestion] = useState<CareerQuestion | null>(null)

  const openQuestions = questions.filter((q) => q.status !== "closed")

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
            aria-label="閉じる"
          >
            <RiCloseLine size={20} />
          </button>
          <h2 className="text-lg font-bold">質問</h2>
          <div className="w-7" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {openQuestions.length === 0 ? (
            <p className="text-sm text-foreground/50 text-center py-12">
              未回答の質問はありません
            </p>
          ) : (
            <ul className="flex flex-col py-4">
              {openQuestions.map((q) => (
                <CareerQuestionItem
                  key={q.id}
                  question={q}
                  onSelect={setSelectedQuestion}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <CareerQuestionAnswerDialog
        key={selectedQuestion?.id}
        open={selectedQuestion !== null}
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
      />
    </Drawer>
  )
}
