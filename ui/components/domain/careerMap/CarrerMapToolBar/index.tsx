"use client"

import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri"

import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"
import { SCALE_MAX,SCALE_MIN } from "../utils/constants"

export default function CarrerMapToolBar() {
  const { scale, setScale } = useCarrerMapEditorContext()

  return (
    <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2 bg-white rounded-lg shadow-md border border-foreground/10 px-3 py-2">
      <button
        type="button"
        className="text-base text-foreground/50 shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-default"
        disabled={scale >= SCALE_MAX}
        onClick={() => setScale(Math.min(scale + 1, SCALE_MAX))}
      >
        <RiZoomOutLine />
      </button>
      <input
        type="range"
        min={SCALE_MIN}
        max={SCALE_MAX}
        step={1}
        value={SCALE_MAX + SCALE_MIN - scale}
        onChange={(e) => setScale(SCALE_MAX + SCALE_MIN - Number(e.target.value))}
        className="w-24"
      />
      <button
        type="button"
        className="text-base text-foreground/50 shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-default"
        disabled={scale <= SCALE_MIN}
        onClick={() => setScale(Math.max(scale - 1, SCALE_MIN))}
      >
        <RiZoomInLine />
      </button>
    </div>
  )
}
