"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import CareerMapEventItem from "../CareerMapEventItem"
import CarrerMapCanvasGrid from "../CarrerMapCanvasGrid"
import CarrerMapCanvasItem from "../CarrerMapCanvasItem"
import CarrerMapCanvasRuler from "../CarrerMapCanvasRuler"
import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"
import { SCALE_DISPLAY_CONFIG } from "../utils/constants"
import { computeCanvasWidth, eventToRect, xToDate, yToRow } from "../utils/timelineMapping"

export default function CarrerMapCanvas() {
  const { state: { events, careerMap, timelineConfig: config, scale, mode }, dispatch, deleteEvent, handleDragStart, handleDragMove, handleDragEnd } = useCarrerMapEditorContext()

  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

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

  // --- Derived from mode ---
  const isPlacement = mode.type === 'placement'
  const selectedEventIds = useMemo(() => mode.type === 'selected' ? mode.selectedEventIds : new Set<string>(), [mode])
  const draggingEventId = mode.type === 'dragging' ? mode.drag.eventId : null
  const previewRect = mode.type === 'dragging' ? mode.previewRect : null

  // --- Placement mode ---
  const [placeholderRect, setPlaceholderRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const { tickWidthPx } = SCALE_DISPLAY_CONFIG[scale - 1]

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isPlacement) {
          e.preventDefault()
          dispatch({ type: 'ENTER_IDLE' })
          setPlaceholderRect(null)
          return
        }
        if (selectedEventIds.size === 0) return
        e.preventDefault()
        dispatch({ type: 'ENTER_IDLE' })
        return
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
        if (selectedEventIds.size === 0) return
        e.preventDefault()
        for (const eventId of selectedEventIds) {
          deleteEvent(eventId)
        }
        dispatch({ type: 'ENTER_IDLE' })
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlacement, selectedEventIds, dispatch, deleteEvent])

  const handleCanvasPointerMove = useCallback((e: React.PointerEvent) => {
    handleDragMove(e)
    if (!isPlacement) return

    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const rect = canvasEl.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    if (canvasY <= headerPx) {
      setPlaceholderRect(null)
      return
    }

    const snappedX = Math.floor(canvasX / tickWidthPx) * tickWidthPx
    const row = yToRow(canvasY, config)
    const rowGapHeight = config.rowGapHeightInUnits * config.unit
    const rowStep = rowHeight + rowGapHeight
    const rowY = headerPx + rowGapHeight + row * rowStep

    setPlaceholderRect({ x: snappedX, y: rowY, width: tickWidthPx, height: rowHeight })
  }, [handleDragMove, isPlacement, headerPx, tickWidthPx, config, rowHeight])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!isPlacement || !placeholderRect) return

    const startDate = xToDate(placeholderRect.x, config)
    const endDate = xToDate(placeholderRect.x + placeholderRect.width, config)
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const rect = canvasEl.getBoundingClientRect()
    const canvasY = e.clientY - rect.top
    const row = yToRow(canvasY, config)

    dispatch({ type: 'OPEN_CREATE_DIALOG', prefill: { row, startDate, endDate } })
    setPlaceholderRect(null)
  }, [isPlacement, placeholderRect, config, dispatch])

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    handleDragEnd(e)
  }, [handleDragEnd])

  return (
    <div ref={scrollRef} className="w-full h-full overflow-auto relative @container">
      <div
        ref={canvasRef}
        className={isPlacement ? "cursor-crosshair" : undefined}
        style={{ width: canvasWidth, minHeight: "100%", height: canvasHeight, position: "relative" }}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onClick={handleCanvasClick}
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
          const isDragging = draggingEventId === event.id
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
                birthDate={careerMap!.startDate!}
                previewStartDate={isDragging && previewRect ? xToDate(previewRect.x, config) : undefined}
                previewEndDate={isDragging && previewRect ? xToDate(previewRect.x + previewRect.width, config) : undefined}
                isDragging={isDragging}
                isSelected={selectedEventIds.has(event.id)}
                rowHeight={rowHeight}
                onSelect={(e: React.MouseEvent) => dispatch({ type: 'SELECT_EVENT', eventId: event.id, shiftKey: e.shiftKey })}
                onDragStart={(e, dragMode) => handleDragStart(e, dragMode, event, rect)}
                onEdit={() => dispatch({ type: 'OPEN_EDIT_DIALOG', event })}
              />
            </CarrerMapCanvasItem>
          )
        })}

        {/* Placement placeholder */}
        {isPlacement && placeholderRect && (
          <div
            className="absolute rounded border-2 border-dashed border-primary-500 bg-primary-500/20 pointer-events-none"
            style={{ left: placeholderRect.x, top: placeholderRect.y, width: placeholderRect.width, height: placeholderRect.height }}
          />
        )}
      </div>
    </div>
  )
}
