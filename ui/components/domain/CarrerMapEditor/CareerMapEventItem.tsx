"use client"

import type { PointerEvent } from "react"
import { RiEditLine } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"

import type { DragMode } from "./hooks/useDragInteraction"
import { eventItemColors } from "./utils/constants"

const HANDLE_SIZE = 8

type CareerMapEventItemProps = {
  event: CareerEvent
  isDragging: boolean
  isSelected: boolean
  readOnly?: boolean
  onSelect: (e: React.MouseEvent) => void
  onDragStart?: (e: PointerEvent, mode: DragMode) => void
  onEdit?: () => void
}

export default function CareerMapEventItem({
  event,
  isDragging,
  isSelected,
  readOnly = false,
  onSelect,
  onDragStart,
  onEdit,
}: CareerMapEventItemProps) {
  const eventType = (event.type ?? "working") as "working" | "living" | "feeling"
  const strength = Math.min(5, Math.max(1, event.strength ?? 3)) as 1 | 2 | 3 | 4 | 5
  const colorClasses = eventItemColors({ eventType, strength })
  const isPoint = event.startDate === event.endDate

  if (isPoint) {
    return (
      <div className="w-full h-full relative">
        <div
          className={[
            "w-full h-full rounded-full border-2 select-none relative group",
            colorClasses,
            isDragging ? "opacity-70 shadow-lg z-50" : "",
            isSelected ? "ring-2 ring-primary-500" : "",
            readOnly ? "" : "cursor-grab active:cursor-grabbing",
          ].filter(Boolean).join(" ")}
          onClick={(e) => { e.stopPropagation(); onSelect(e) }}
          onPointerDown={!readOnly && onDragStart ? (e) => onDragStart(e, "move") : undefined}
        >
          {!readOnly && onEdit && (
            <button
              type="button"
              className="absolute -top-1 -right-1 z-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-white/80 hover:bg-white p-0.5 shadow-sm"
              onClick={(e) => { e.stopPropagation(); onEdit() }}
            >
              <RiEditLine className="w-3 h-3" />
            </button>
          )}
        </div>
        <div
          className="absolute text-xs font-medium text-center text-foreground/80 whitespace-nowrap pointer-events-none"
          style={{ top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 2 }}
        >
          {event.startName ?? event.name}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div
        className={[
          "w-full h-full rounded border select-none flex flex-col relative group",
          colorClasses,
          isDragging ? "opacity-70 shadow-lg z-50" : "",
          isSelected ? "ring-2 ring-primary-500 border-primary-500" : "",
        ].filter(Boolean).join(" ")}
        onClick={(e) => { e.stopPropagation(); onSelect(e) }}
      >
        {!readOnly && onEdit && (
          <button
            type="button"
            className="absolute top-0.5 right-1 z-20 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/10 p-2"
            onClick={(e) => { e.stopPropagation(); onEdit() }}
          >
            <RiEditLine className="w-4 h-4" />
          </button>
        )}

        {!readOnly && onDragStart && (
          <div
            className="absolute left-0 top-0 h-full cursor-col-resize z-10"
            style={{ width: HANDLE_SIZE }}
            onPointerDown={(e) => onDragStart(e, "resize-start")}
          />
        )}

        <div
          className={[
            "flex-1 px-2 py-1 overflow-hidden",
            readOnly ? "" : "cursor-grab active:cursor-grabbing",
          ].filter(Boolean).join(" ")}
          onPointerDown={!readOnly && onDragStart ? (e) => onDragStart(e, "move") : undefined}
        />

        {!readOnly && onDragStart && (
          <div
            className="absolute right-0 top-0 h-full cursor-col-resize z-10"
            style={{ width: HANDLE_SIZE }}
            onPointerDown={(e) => onDragStart(e, "resize-end")}
          />
        )}

        {!readOnly && onDragStart && (
          <div
            className="absolute bottom-0 left-0 w-full cursor-row-resize z-10"
            style={{ height: HANDLE_SIZE }}
            onPointerDown={(e) => onDragStart(e, "strength")}
          />
        )}
      </div>

      <div
        className="absolute text-xs font-medium text-center text-foreground/80 pointer-events-none"
        style={{ top: "100%", left: 0, right: 0, paddingTop: 2 }}
      >
        <span className="truncate block">{event.name}</span>
      </div>
    </div>
  )
}
