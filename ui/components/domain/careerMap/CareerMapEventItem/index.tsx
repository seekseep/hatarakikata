"use client"

import type { PointerEvent } from "react"
import { RiEditLine } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"

import type { DragMode } from "../hooks/useDragInteraction"
import { eventCircleBorderColors, eventItemColors } from "../utils/constants"

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
  readOnly?: boolean
  rowHeight: number
  onSelect: (e: React.MouseEvent) => void
  onDragStart?: (e: PointerEvent, mode: DragMode) => void
  onEdit?: () => void
}

export default function CareerMapEventItem({
  event,
  birthDate,
  previewStartDate,
  previewEndDate,
  isDragging,
  isSelected,
  readOnly = false,
  rowHeight,
  onSelect,
  onDragStart,
  onEdit,
}: CareerMapEventItemProps) {
  const circleSize = rowHeight * 0.6
  const eventType = (event.type ?? "working") as "working" | "living" | "feeling"
  const strength = Math.min(5, Math.max(1, event.strength ?? 3)) as 1 | 2 | 3 | 4 | 5
  const colorClasses = eventItemColors({ eventType, strength })

  const circleBorderColor = eventCircleBorderColors({ eventType, strength })

  const editButtonOffset = rowHeight ? rowHeight * 0.1 : 2
  const editButtonSize = rowHeight ? rowHeight - 2 * editButtonOffset : 20
  const editIconSize = editButtonSize * 0.6

  const isPoint = !!event.startDate && event.startDate === event.endDate

  if (isPoint) {
    return (
      <div className="w-full h-full relative">
        <div
          className={[
            "w-full h-full rounded-full border-2 select-none relative group",
            colorClasses,
            isDragging ? "opacity-70 shadow-lg z-50" : "",
            isSelected ? "ring-2 ring-primary-500" : "",
            readOnly ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
          ].filter(Boolean).join(" ")}
          onClick={(e) => { e.stopPropagation(); onSelect(e) }}
          onPointerDown={!readOnly && onDragStart ? (e) => onDragStart(e, "move") : undefined}
        >
          {!readOnly && onEdit && (
            <button
              type="button"
              className="absolute inset-0 z-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:bg-black/20"
              onClick={(e) => { e.stopPropagation(); onEdit() }}
            >
              <RiEditLine className="w-3 h-3" />
            </button>
          )}
        </div>
        <div
          className="absolute text-xs font-medium text-center text-foreground/80 whitespace-nowrap pointer-events-none"
          style={{ top: "100%", paddingTop: 2 }}
        >
          {event.startName ?? event.name}
        </div>
      </div>
    )
  }

  const editInStartCircle = !readOnly && !!onEdit && !event.endName && !!event.startDate && !!event.startName

  const displayStartDate = previewStartDate ?? event.startDate
  const displayEndDate = previewEndDate ?? event.endDate
  const startAge = calcAge(birthDate, displayStartDate)
  const endAge = calcAge(birthDate, displayEndDate)
  const startMonth = `${new Date(displayStartDate).getFullYear()}年${new Date(displayStartDate).getMonth() + 1}月`
  const endMonth = `${new Date(displayEndDate).getFullYear()}年${new Date(displayEndDate).getMonth() + 1}月`

  return (
    <div className="w-full h-full relative group">
      <div className="left-0 mb-0.75 right-0 bottom-full absolute text-xs flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="bg-gray-50 rounded sticky left-0 px-1">{startAge}歳</div>
        <div className="bg-gray-50 rounded sticky right-0 px-1">{endAge}歳</div>
      </div>
      <div className="left-0 right-0 top-full absolute text-xs flex justify-between">
        <div className="bg-gray-50 rounded sticky left-0 px-1">{startMonth}</div>
        <div className="bg-gray-50 rounded sticky right-0 px-1">{endMonth}</div>
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
        {!editInStartCircle && !readOnly && onEdit && (
          <button
            type="button"
            className="absolute z-20 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/10 flex items-center justify-center"
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
          {event.name && (
            <span className="text-xs font-medium truncate pointer-events-none select-none sticky left-0 right-0 px-1">
              {event.name}
            </span>
          )}
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

      {event.startName && (
        <div
          className={`absolute rounded-full border-2 bg-white pointer-events-none ${circleBorderColor}`}
          style={{ width: circleSize, height: circleSize, left: 0, top: "50%", transform: "translate(-50%, -50%)", zIndex: 50 }}
        />
      )}
      {editInStartCircle && (
        <button
          type="button"
          className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:bg-black/20"
          style={{ width: circleSize, height: circleSize, left: 0, top: "50%", transform: "translate(-50%, -50%)", zIndex: 51 }}
          onClick={(e) => { e.stopPropagation(); onEdit!() }}
        >
          <RiEditLine style={{ width: circleSize * 0.55, height: circleSize * 0.55 }} />
        </button>
      )}
      {event.endName && (
        <div
          className={`absolute rounded-full border-2 bg-white pointer-events-none ${circleBorderColor}`}
          style={{ width: circleSize, height: circleSize, right: 0, top: "50%", transform: "translate(50%, -50%)", zIndex: 50 }}
        />
      )}

      {event.startName && (
        <span
          className="absolute text-xs font-medium text-foreground/80 pointer-events-none whitespace-nowrap"
          style={{ top: "100%", left: 0, transform: "translateX(-50%)", paddingTop: 2, zIndex: 60 }}
        >
          {event.startName}
        </span>
      )}
      {event.endName && (
        <span
          className="absolute text-xs font-medium text-foreground/80 pointer-events-none whitespace-nowrap"
          style={{ top: "100%", right: 0, transform: "translateX(50%)", paddingTop: 2, zIndex: 60 }}
        >
          {event.endName}
        </span>
      )}
    </div>
  )
}
