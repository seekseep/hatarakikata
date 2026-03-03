import { createContext, useContext } from "react"

import type { CarrerMapEditorStore } from "./useCarrerMapEditor"

export const CarrerMapEditorContext = createContext<CarrerMapEditorStore | null>(null)

export function useCarrerMapEditorContext(): CarrerMapEditorStore {
  const ctx = useContext(CarrerMapEditorContext)
  if (!ctx) {
    throw new Error("useCarrerMapEditorContext must be used within a CarrerMapEditorProvider")
  }
  return ctx
}
