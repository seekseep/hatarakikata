import { createContext, useContext } from "react"

import type { CarrerMapEditorState } from "./useCarrerMapEditor"

export const CarrerMapEditorContext = createContext<CarrerMapEditorState | null>(null)

export function useCarrerMapEditorContext(): CarrerMapEditorState {
  const ctx = useContext(CarrerMapEditorContext)
  if (!ctx) {
    throw new Error("useCarrerMapEditorContext must be used within a CarrerMapEditorProvider")
  }
  return ctx
}
