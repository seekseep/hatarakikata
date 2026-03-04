"use client"

import type { PointerEvent } from "react"
import { RiEditLine } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"

import type { DragMode } from "../hooks/EditorState"
import { eventItemColors } from "../utils/constants"

const HANDLE_SIZE = 8

function calcAge(birthDate: string, targetDate: string): number {
  const birth = new Date(birthDate)
  const target = new Date(targetDate)
  let age = target.getFullYear() - birth.getFullYear()
  const m = target.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && target.getDate() < birth.getDate())) age--
  return age
}

type CareerMapEventItemProps = {
  event: CareerEvent
  birthDate: string
  previewStartDate?: string
  previewEndDate?: string
  isDragging: boolean
  isSelected: boolean
  isHovered: boolean | null
  readOnly?: boolean
  rowHeight: number
  onSelect: (e: React.MouseEvent) => void
  onDragStart?: (e: PointerEvent, mode: DragMode) => void
  onEdit?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

export default function CareerMapEventItem({
  event,
  birthDate,
  previewStartDate,
  previewEndDate,
  isDragging,
  isSelected,
  isHovered,
  readOnly = false,
  rowHeight,
  onSelect,
  onDragStart,
  onEdit,
  onPointerEnter,
  onPointerLeave,
}: CareerMapEventItemProps) {
  const eventType = (event.type ?? "working") as "working" | "living" | "feeling"
  const strength = Math.min(5, Math.max(1, event.strength ?? 3)) as 1 | 2 | 3 | 4 | 5
  const colorClasses = eventItemColors({ eventType, strength })

  const editButtonOffset = rowHeight ? rowHeight * 0.1 : 2
  const editButtonSize = rowHeight ? rowHeight - 2 * editButtonOffset : 20
  const editIconSize = editButtonSize * 0.6

  const displayStartDate = previewStartDate ?? event.startDate
  const displayEndDate = previewEndDate ?? event.endDate
  const startAge = calcAge(birthDate, displayStartDate)
  const endAge = calcAge(birthDate, displayEndDate)
  const startMonth = `${new Date(displayStartDate).getFullYear()}年${new Date(displayStartDate).getMonth() + 1}月`
  const endMonth = `${new Date(displayEndDate).getFullYear()}年${new Date(displayEndDate).getMonth() + 1}月`

  return (
    <div className="w-full h-full relative" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <div className={[
        "left-0 mb-0.75 right-0 bottom-full absolute text-xs flex justify-between transition-opacity z-50",
        isHovered === true ? "opacity-100" : "opacity-0",
      ].join(" ")}>
        <div className="bg-gray-50 rounded sticky left-0 px-1">{startAge}歳</div>
        <div className="bg-gray-50 rounded sticky right-0 px-1">{endAge}歳</div>
      </div>
      <div className={[
        "left-0 right-0 top-full absolute text-xs flex justify-between transition-opacity",
        isHovered === false ? "opacity-0" : "opacity-100",
      ].join(" ")}>
        <div className="bg-gray-50 rounded sticky left-0 px-1 truncate">{startMonth}</div>
        <div className="bg-gray-50 rounded sticky right-0 px-1 truncate">{endMonth}</div>
      </div>
      <div
        className={[
          "w-full h-full rounded border select-none flex flex-col relative",
          colorClasses,
          isDragging ? "opacity-70 shadow-lg z-50" : "",
          isSelected ? "ring-2 ring-primary-500 border-primary-500" : "",
        ].filter(Boolean).join(" ")}
        onClick={(e) => { e.stopPropagation(); onSelect(e) }}
      >
        {!readOnly && onEdit && (
          <button
            type="button"
            className={[
              "absolute z-20 rounded transition-opacity cursor-pointer hover:bg-black/10 flex items-center justify-center",
              isHovered === true ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{ top: editButtonOffset, right: editButtonOffset, width: editButtonSize, height: editButtonSize }}
            onClick={(e) => { e.stopPropagation(); onEdit() }}
          >
            <RiEditLine style={{ width: editIconSize, height: editIconSize }} />
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
            "flex-1 px-2 py-1 overflow-x-clip flex items-center justify-center",
            readOnly ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
          ].filter(Boolean).join(" ")}
          onPointerDown={!readOnly && onDragStart ? (e) => onDragStart(e, "move") : undefined}
        >
          <span className="text-xs font-medium truncate pointer-events-none select-none sticky left-0 right-0 px-1">
            {event.name}
          </span>
        </div>

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
    </div>
  )
}
