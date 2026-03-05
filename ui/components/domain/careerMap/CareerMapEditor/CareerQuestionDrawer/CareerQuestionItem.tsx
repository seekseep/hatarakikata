import { RiCloseLine } from "react-icons/ri"

import type { CareerQuestion } from "@/core/domain"
import Spinner from "@/ui/components/basic/Spinner"
import { useCloseQuestionMutation } from "@/ui/hooks/careerQuestion"

import { closeQuestion, revertProcessQuestion, startProcessQuestion } from "../../actions/questionActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"

type CareerQuestionItemProps = {
  question: CareerQuestion
  onSelect: (question: CareerQuestion) => void
}

export default function CareerQuestionItem({ question, onSelect }: CareerQuestionItemProps) {
  const { dispatch } = useCarrerMapEditorContext()
  const closeMutation = useCloseQuestionMutation(question.careerMapId)
  const isProcessing = question.status === "processing"

  const handleClose = () => {
    dispatch(startProcessQuestion(question.id))
    closeMutation.mutate(question.id, {
      onSuccess: () => {
        dispatch(closeQuestion(question.id))
      },
      onError: () => {
        dispatch(revertProcessQuestion(question.id))
      },
    })
  }

  return (
    <li className={`flex gap-2 border-b border-b-foreground/5 ${isProcessing ? "animate-pulse opacity-50" : ""}`}>
      <div className="grow">
        <button
          className="font-medium hover:underline pl-4 pr-2 py-3 cursor-pointer hover:text-primary-500 disabled:cursor-default disabled:no-underline disabled:text-foreground/40"
          disabled={isProcessing}
          onClick={() => onSelect(question)}>
          {question.title}
        </button>
      </div>
      <button
        type="button"
        className="p-1.5 w-12 flex items-center justify-center hover:bg-foreground/10 transition-colors text-foreground/40 hover:text-foreground/70"
        aria-label="質問を閉じる"
        disabled={isProcessing || closeMutation.isPending}
        onClick={handleClose}
      >
        {isProcessing || closeMutation.isPending ? <Spinner size="small" /> : <RiCloseLine size={16} />}
      </button>
    </li>
  )
}
