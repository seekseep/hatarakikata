"use client"

import { useRef, useState } from "react"
import { RiAddLine, RiChat3Line, RiCodeLine, RiFlagLine, RiSearchLine, RiSparklingLine } from "react-icons/ri"
import { tv } from "tailwind-variants"

import { useCareerQuestionsQuery } from "@/ui/hooks/careerQuestion"
import { useMyCareerGuidesQuery } from "@/ui/hooks/careerGuide"

import { openGenerateDialog, openCareerGuidePromptDialog, openCareerGuidesDrawer, openJsonImportDialog, openQuestionsDrawer, openSearchDrawer } from "../actions/dialogActions"
import { enterPlacement } from "../actions/modeActions"
import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"

const actionButton = tv({
  base: "rounded-full w-10 h-10 inline-flex items-center justify-center transition-colors cursor-pointer",
  variants: {
    variant: {
      default:
        "text-foreground/60 hover:bg-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed",
      primary: "bg-primary-500 text-white hover:bg-primary-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export default function CarrerMapCanvasActions() {
  const { dispatch } = useCarrerMapEditorContext()
  const [devMenuOpen, setDevMenuOpen] = useState(false)
  const devButtonRef = useRef<HTMLButtonElement>(null)
  const questionsQuery = useCareerQuestionsQuery()
  const openQuestionCount = (questionsQuery.data ?? []).filter((q) => q.status === "open").length
  const careerGuidesQuery = useMyCareerGuidesQuery()
  const guideCount = (careerGuidesQuery.data ?? []).length

  const handleDevMenuItemClick = (action: () => void) => {
    setDevMenuOpen(false)
    action()
  }

  const handleCareerGuideClick = () => {
    if (guideCount > 0) {
      dispatch(openCareerGuidesDrawer())
    } else {
      dispatch(openCareerGuidePromptDialog())
    }
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-white rounded-full shadow-lg p-1.5">
      <div className="relative">
        <button
          ref={devButtonRef}
          type="button"
          className={actionButton()}
          onClick={() => setDevMenuOpen((v) => !v)}
        >
          <RiCodeLine className="text-xl" />
        </button>
        {devMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDevMenuOpen(false)}
            />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg border border-foreground/10 py-1 min-w-max">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm hover:bg-foreground/5 transition-colors"
                onClick={() => handleDevMenuItemClick(() => dispatch(openJsonImportDialog()))}
              >
                JSONイベントインポート
              </button>
            </div>
          </>
        )}
      </div>
      <div className="relative">
        <button type="button" className={actionButton()} onClick={() => dispatch(openQuestionsDrawer())}>
          <RiChat3Line className="text-xl" />
        </button>
        {openQuestionCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
            {openQuestionCount}
          </span>
        )}
      </div>
      <button type="button" className={actionButton()} onClick={handleCareerGuideClick}>
        <RiFlagLine className="text-xl" />
      </button>
      <button type="button" className={actionButton()} onClick={() => dispatch(openSearchDrawer())}>
        <RiSearchLine className="text-xl" />
      </button>
      <button
        type="button"
        className={actionButton()}
        onClick={() => dispatch(openGenerateDialog())}
      >
        <RiSparklingLine className="text-xl" />
      </button>
      <button
        type="button"
        className={actionButton({ variant: "primary" })}
        onClick={() => dispatch(enterPlacement())}>
        <RiAddLine className="text-xl" />
      </button>
    </div>
  )
}
