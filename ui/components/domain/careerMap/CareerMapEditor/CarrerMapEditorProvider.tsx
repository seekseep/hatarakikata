import type { ReactNode } from "react"

import { CarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"
import type { CarrerMapEditorStore } from "../hooks/useCarrerMapEditor"

type CarrerMapEditorProviderProps = {
  value: CarrerMapEditorStore
  children: ReactNode
}

export function CarrerMapEditorProvider({ value, children }: CarrerMapEditorProviderProps) {
  return (
    <CarrerMapEditorContext.Provider value={value}>
      {children}
    </CarrerMapEditorContext.Provider>
  )
}
