"use client"

import { RiSparklingLine } from "react-icons/ri"

import { openGenerateDialog } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function GenerateButton() {
  const { dispatch } = useCarrerMapEditorContext()
  return (
    <ActionButton
      tooltip="AI生成"
      icon={<RiSparklingLine className="text-xl" />}
      onClick={() => dispatch(openGenerateDialog())}
    />
  )
}
