"use client"

import { RiSearchLine } from "react-icons/ri"

import { openSearchDrawer } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function SearchButton() {
  const { dispatch } = useCarrerMapEditorContext()
  return (
    <ActionButton
      tooltip="検索"
      icon={<RiSearchLine className="text-xl" />}
      onClick={() => dispatch(openSearchDrawer())}
    />
  )
}
