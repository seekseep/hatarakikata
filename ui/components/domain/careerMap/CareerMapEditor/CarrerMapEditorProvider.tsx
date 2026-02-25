import type { ReactNode } from "react"

import { CarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"
import type { CarrerMapEditorState } from "../hooks/useCarrerMapEditor"

type CarrerMapEditorProviderProps = {
  value: CarrerMapEditorState
  children: ReactNode
}

export function CarrerMapEditorProvider({ value, children }: CarrerMapEditorProviderProps) {
  return (
    <CarrerMapEditorContext.Provider value={value}>
      {children}
    </CarrerMapEditorContext.Provider>
  )
}
