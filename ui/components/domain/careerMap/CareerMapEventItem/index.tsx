"use client"

import clsx from "clsx"
import type { PointerEvent } from "react"
import { RiEditLine } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"

import type { DragMode } from "../hooks/EditorState"
import { eventItemColors } from "../variants"

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
  const editButtonSize = rowHeight * 2.5
  const editIconSize = editButtonSize * 0.6

  const displayStartDate = previewStartDate ?? event.startDate
  const displayEndDate = previewEndDate ?? event.endDate
  const startAge = calcAge(birthDate, displayStartDate)
  const endAge = calcAge(birthDate, displayEndDate)
  const startMonth = `${new Date(displayStartDate).getFullYear()}年${new Date(displayStartDate).getMonth() + 1}月`
  const endMonth = `${new Date(displayEndDate).getFullYear()}年${new Date(displayEndDate).getMonth() + 1}月`

  return (
    <div className="w-full h-full relative" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <div className={clsx(
        "left-0 right-0 bottom-full absolute text-xs flex justify-between transition",
        { "opacity-0": isHovered === false, "opacity-100": isHovered !== false, "text-gray-400": isHovered !== true, "text-gray-700": isHovered === true },
      )}>
        <div className="bg-gray-50 rounded sticky left-0 px-1 truncate">{startMonth}</div>
        <div className="bg-gray-50 rounded sticky right-0 px-1 truncate">{endMonth}</div>
      </div>
      <div className={clsx(
        "left-0 mb-0.75 right-0 top-full absolute text-xs flex justify-between transition z-50",
        { "opacity-100": isHovered === true, "opacity-0": isHovered !== true, "text-gray-700": isHovered === true, "text-gray-400": isHovered !== true },
      )}>
        <div className="bg-gray-50 rounded sticky left-0 px-1">{startAge}歳</div>
        <div className="bg-gray-50 rounded sticky right-0 px-1">{endAge}歳</div>
      </div>
      <div
        className={clsx(
          "w-full h-full rounded select-none flex flex-col relative",
          colorClasses,
          { "opacity-70 shadow-lg z-50": isDragging, "ring-2 ring-primary-500 z-40": isSelected },
        )}
        onClick={(e) => { e.stopPropagation(); onSelect(e) }}
      >
        {!readOnly && onEdit && (
          <button
            type="button"
            className={clsx(
              "absolute z-20 rounded transition-opacity cursor-pointer hover:bg-black/10 flex items-center justify-center",
              { "opacity-100": isHovered === true, "opacity-0": isHovered !== true },
            )}
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
          className={clsx(
            "flex-1 px-2 py-1 overflow-x-clip flex items-center justify-center",
            readOnly ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
          )}
          onPointerDown={!readOnly && onDragStart ? (e) => onDragStart(e, "move") : undefined}
        >
          <span className="text-sm font-medium truncate pointer-events-none select-none sticky left-0 right-0 px-1">
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
