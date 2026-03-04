"use client"

import { RiAddLine } from "react-icons/ri"

import { enterPlacement } from "../../actions/modeActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function AddEventButton() {
  const { dispatch } = useCarrerMapEditorContext()
  return (
    <ActionButton
      tooltip="イベント追加"
      icon={<RiAddLine className="text-xl" />}
      variant="primary"
      onClick={() => dispatch(enterPlacement())}
    />
  )
}
