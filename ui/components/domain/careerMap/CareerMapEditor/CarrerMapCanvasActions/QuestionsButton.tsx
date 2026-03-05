"use client"

import { RiChat3Line } from "react-icons/ri"

import { openQuestionsDrawer } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function QuestionsButton() {
  const { dispatch, state: { questions } } = useCarrerMapEditorContext()
  const openQuestionCount = questions.filter((q) => q.status === "open").length

  return (
    <ActionButton
      tooltip="質問"
      icon={<RiChat3Line className="text-xl" />}
      onClick={() => dispatch(openQuestionsDrawer())}
      badge={openQuestionCount > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
          {openQuestionCount}
        </span>
      ) : undefined}
    />
  )
}
