"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

import type { CareerEvent } from "@/core/domain"

import CareerMapEventItem from "../CareerMapEventItem"
import CarrerMapCanvasGrid from "../CarrerMapCanvasGrid"
import CarrerMapCanvasItem from "../CarrerMapCanvasItem"
import CarrerMapCanvasRuler from "../CarrerMapCanvasRuler"
import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"
import { useDragInteraction } from "../hooks/useDragInteraction"
import { usePanInteraction } from "../hooks/usePanInteraction"
import { computeCanvasWidth, eventToRect, xToDate, yToRow } from "../utils/timelineMapping"

export default function CarrerMapCanvas() {
  const { events, careerMap, timelineConfig: config, scale, updateEvent, openEditDialog, openCreateDialog, selectedEventIds, selectEvent, clearSelection, deleteSelectedEvents } = useCarrerMapEditorContext()

  // Normalize PointEvents: keep endDate == startDate after DnD
  const handleUpdateEvent = useCallback((updatedEvent: CareerEvent) => {
    const original = events.find(e => e.id === updatedEvent.id)
    if (original && original.startDate === original.endDate) {
      updateEvent({ ...updatedEvent, endDate: updatedEvent.startDate })
    } else {
      updateEvent(updatedEvent)
    }
  }, [events, updateEvent])

  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const { dragState, previewRect, handlePointerDown: handleDragPointerDown, handlePointerMove: handleDragPointerMove, handlePointerUp: handleDragPointerUp } =
    useDragInteraction(config, handleUpdateEvent)
  const { handlePointerDown: handlePanPointerDown, handlePointerMove: handlePanPointerMove, handlePointerUp: handlePanPointerUp } =
    usePanInteraction(scrollRef, canvasRef, !!dragState)

  const canvasWidth = computeCanvasWidth(config)
  const headerPx = config.headerHeightInUnits * config.unit
  const rowHeight = config.rowHeightInUnits * config.unit

  // Canvas height: enough rows to fill viewport + accommodate all events
  const maxEventBottom = useMemo(() => {
    let max = 0
    for (const event of events) {
      const rect = eventToRect(event, config)
      const bottom = rect.y + rect.height
      if (bottom > max) max = bottom
    }
    return max
  }, [events, config])

  const minContentHeight = headerPx + 600
  const canvasHeight = Math.max(minContentHeight, maxEventBottom + rowHeight * 4)

  // Delete key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedEventIds.size === 0) return
        e.preventDefault()
        clearSelection()
        return
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
        if (selectedEventIds.size === 0) return
        e.preventDefault()
        deleteSelectedEvents()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedEventIds, clearSelection, deleteSelectedEvents])

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    handlePanPointerDown(e)
  }, [handlePanPointerDown])

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    handleDragPointerMove(e)
    handlePanPointerMove(e)
  }, [handleDragPointerMove, handlePanPointerMove])

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    const wasDraggingEvent = !!dragState
    handleDragPointerUp(e)
    const wasPanning = handlePanPointerUp()

    if (wasPanning || wasDraggingEvent) return

    // Click on canvas background → clear selection & create event
    clearSelection()

    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const rect = canvasEl.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    if (canvasY <= headerPx) return

    const row = yToRow(canvasY, config)
    const startDate = xToDate(canvasX, config)
    const start = new Date(startDate)
    const end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate())
    const endDate = end.toISOString().split("T")[0]
    openCreateDialog({ row, startDate, endDate })
  }, [dragState, handleDragPointerUp, handlePanPointerUp, clearSelection, config, headerPx, openCreateDialog])

  return (
    <div ref={scrollRef} className="w-full h-full overflow-auto relative">
      <div
        ref={canvasRef}
        className="cursor-grab"
        style={{ width: canvasWidth, minHeight: "100%", height: canvasHeight, position: "relative" }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
      >
        <CarrerMapCanvasRuler
          startDate={careerMap!.startDate!}
          endDate={careerMap!.endDate}
          scale={scale}
        />

        <CarrerMapCanvasGrid
          startDate={careerMap!.startDate!}
          endDate={careerMap!.endDate}
          scale={scale}
          canvasHeight={canvasHeight}
        />

        {/* Events */}
        {events.map((event) => {
          const rect = eventToRect(event, config)
          const isDragging = dragState?.eventId === event.id
          const isPoint = event.startDate === event.endDate

          // For PointEvent: use a square container sized to one row height
          const pointSize = config.rowHeightInUnits * config.unit
          const pointRect = isPoint
            ? { x: rect.x + config.unit / 2 - pointSize / 2, y: rect.y, width: pointSize, height: pointSize }
            : rect
          const displayRect = isDragging && previewRect
            ? (isPoint
              ? { x: previewRect.x + config.unit / 2 - pointSize / 2, y: previewRect.y, width: pointSize, height: pointSize }
              : previewRect)
            : (isPoint ? pointRect : rect)

          return (
            <CarrerMapCanvasItem
              key={event.id}
              x={displayRect.x}
              y={displayRect.y}
              width={displayRect.width}
              height={displayRect.height}
            >
              <CareerMapEventItem
                event={event}
                isDragging={isDragging}
                isSelected={selectedEventIds.has(event.id)}
                rowHeight={rowHeight}
                onSelect={(e: React.MouseEvent) => selectEvent(event.id, e.shiftKey)}
                onDragStart={(e, mode) => handleDragPointerDown(e, mode, event, rect)}
                onEdit={() => openEditDialog(event)}
              />
            </CarrerMapCanvasItem>
          )
        })}
      </div>
    </div>
  )
}
