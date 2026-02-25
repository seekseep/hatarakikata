import type { ReactNode } from "react"

type CarrerMapEditorContainerProps = {
  children: ReactNode
}

export default function CarrerMapEditorContainer({ children }: CarrerMapEditorContainerProps) {
  return (
    <div className="bg-gray-50 w-full h-full relative">
      {children}
    </div>
  )
}
