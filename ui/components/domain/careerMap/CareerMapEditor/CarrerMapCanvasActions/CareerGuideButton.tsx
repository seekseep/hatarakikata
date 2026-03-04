"use client"

import { RiFlagLine } from "react-icons/ri"

import { useMyCareerGuidesQuery } from "@/ui/hooks/careerGuide"

import { openCareerGuidePromptDialog, openCareerGuidesDrawer } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function CareerGuideButton() {
  const { dispatch } = useCarrerMapEditorContext()
  const careerGuidesQuery = useMyCareerGuidesQuery()
  const guideCount = (careerGuidesQuery.data ?? []).length

  return (
    <ActionButton
      tooltip="キャリアガイド"
      icon={<RiFlagLine className="text-xl" />}
      onClick={() => {
        if (guideCount > 0) {
          dispatch(openCareerGuidesDrawer())
        } else {
          dispatch(openCareerGuidePromptDialog())
        }
      }}
    />
  )
}
