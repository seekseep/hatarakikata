import type { ReactNode } from "react"

export type CarrerMapCanvasItemProps = {
  x: number
  y: number
  width: number
  height: number
  children: ReactNode
}

export default function CarrerMapCanvasItem({ x, y, width, height, children }: CarrerMapCanvasItemProps) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, width, height }}
    >
      {children}
    </div>
  )
}
