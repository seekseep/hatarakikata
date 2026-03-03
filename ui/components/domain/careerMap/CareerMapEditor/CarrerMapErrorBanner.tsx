"use client"

import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"

export default function CarrerMapErrorBanner() {
  const { state: { error } } = useCarrerMapEditorContext()

  if (!error) return null

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-800 rounded-md px-4 py-2 text-sm shadow-md">
      {error.message || "エラーが発生しました"}
    </div>
  )
}
