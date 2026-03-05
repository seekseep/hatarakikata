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
  const isProcessing = question.status === "processing"

  return (
    <button
      type="button"
      className={`w-full h-full rounded border-2 border-dashed transition-colors flex items-center justify-center ${
        isProcessing
          ? "border-foreground/20 bg-foreground/5 cursor-default animate-pulse"
          : "border-primary-500 bg-primary-500/10 hover:bg-primary-500/20 cursor-pointer"
      }`}
      disabled={isProcessing}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <span className={`text-xs font-medium truncate px-2 select-none ${
        isProcessing ? "text-foreground/40" : "text-primary-700"
      }`}>
        {question.title}
      </span>
    </button>
  )
}
