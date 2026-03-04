"use client"

import type { CareerQuestion } from "@/core/domain"

type CareerQuestionPlaceholderItemProps = {
  question: CareerQuestion
  onClick: () => void
}

export default function CareerQuestionPlaceholderItem({
  question,
  onClick,
}: CareerQuestionPlaceholderItemProps) {
  return (
    <button
      type="button"
      className="w-full h-full rounded border-2 border-dashed border-primary-500 bg-primary-500/10 hover:bg-primary-500/20 cursor-pointer transition-colors flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <span className="text-xs font-medium text-primary-700 truncate px-2 select-none">
        {question.title}
      </span>
    </button>
  )
}
