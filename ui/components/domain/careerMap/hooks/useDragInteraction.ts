"use client"

import { useCallback, useRef } from "react"

import type { CareerEvent } from "@/core/domain"

import type { TimelineConfig } from "../utils/constants"
import { dateToX, type Rect, xToDate, yToRow } from "../utils/timelineMapping"
import type { EditorAction } from "./EditorAction"
import type { DragMode, DragPayload } from "./EditorState"

// --- Preview 計算（純粋関数） ---

export function computeMovePreview(
  drag: DragPayload,
  dx: number,
  dy: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect, originalEvent } = drag
  const rowHeight = config.rowHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = rowHeight + rowGapHeight

  const snappedStartX = snapX(startRect.x + dx)
  const snappedEndX = snapX(startRect.x + startRect.width + dx)
  const newRow = yToRow(startRect.y + dy, config)
  const rowTopPx = config.headerHeightInUnits * config.unit + rowGapHeight + newRow * rowStep
  const strength = originalEvent.strength ?? 3
  const height = strength * rowHeight + (strength - 1) * rowGapHeight

  return {
    x: snappedStartX,
    y: rowTopPx,
    width: Math.max(snappedEndX - snappedStartX, config.unit),
    height,
  }
}

export function computeResizeStartPreview(
  drag: DragPayload,
  dx: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect } = drag
  const snappedX = snapX(startRect.x + dx)
  const endX = startRect.x + startRect.width
  return {
    x: snappedX,
    y: startRect.y,
    width: Math.max(endX - snappedX, config.unit),
    height: startRect.height,
  }
}

export function computeResizeEndPreview(
  drag: DragPayload,
  dx: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect } = drag
  const snappedEndX = snapX(startRect.x + startRect.width + dx)
  return {
    x: startRect.x,
    y: startRect.y,
    width: Math.max(snappedEndX - startRect.x, config.unit),
    height: startRect.height,
  }
}

export function computeStrengthPreview(
  drag: DragPayload,
  dy: number,
  config: TimelineConfig,
): { rect: Rect; strength: number } {
  const { startRect, originalEvent } = drag
  const rowHeight = config.rowHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = rowHeight + rowGapHeight

  const currentStrength = originalEvent.strength ?? 3
  const strengthDelta = dy / rowStep
  const strength = Math.round(Math.min(config.maxStrength, Math.max(1, currentStrength + strengthDelta)))
  const height = strength * rowHeight + (strength - 1) * rowGapHeight

  return { rect: { x: startRect.x, y: startRect.y, width: startRect.width, height }, strength }
}

// --- Commit 計算（純粋関数） ---

export function computeCommittedEvent(
  dragMode: DragMode,
  drag: DragPayload,
  dx: number,
  dy: number,
  config: TimelineConfig,
): CareerEvent {
  const { originalEvent, startRect } = drag
  const rowStep = (config.rowHeightInUnits + config.rowGapHeightInUnits) * config.unit

  if (dragMode === "move") {
    const newStartX = startRect.x + dx
    const newEndX = newStartX + startRect.width
    return {
      ...originalEvent,
      startDate: xToDate(newStartX, config),
      endDate: xToDate(newEndX, config),
      row: yToRow(startRect.y + dy, config),
    }
  }

  if (dragMode === "resize-start") {
    const newWidth = Math.max(startRect.width - dx, config.unit)
    const newX = startRect.x + startRect.width - newWidth
    return { ...originalEvent, startDate: xToDate(newX, config) }
  }

  if (dragMode === "resize-end") {
    const newWidth = Math.max(startRect.width + dx, config.unit)
    return { ...originalEvent, endDate: xToDate(startRect.x + newWidth, config) }
  }

  // strength
  const currentStrength = originalEvent.strength ?? 3
  const strengthDelta = dy / rowStep
  const newStrength = Math.round(Math.min(config.maxStrength, Math.max(1, currentStrength + strengthDelta)))
  return { ...originalEvent, strength: newStrength }
}

// --- Hook ---

type DragRef = {
  dragMode: DragMode
  drag: DragPayload
}

export function useDragInteraction(
  config: TimelineConfig,
  dispatch: React.Dispatch<EditorAction>,
  onUpdate: (event: CareerEvent) => void,
) {
  const dragRef = useRef<DragRef | null>(null)

  const handleDragStart = useCallback((
    e: React.PointerEvent,
    dragMode: DragMode,
    event: CareerEvent,
    rect: Rect,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    const drag: DragPayload = {
      eventId: event.id,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startRect: rect,
      originalEvent: event,
    }
    dragRef.current = { dragMode, drag }
    dispatch({ type: 'START_DRAG', dragMode, drag, rect, strength: event.strength ?? 3 })
  }, [dispatch])

  const snapX = useCallback((x: number) => {
    return dateToX(xToDate(x, config), config)
  }, [config])

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    const ref = dragRef.current
    if (!ref) return

    const dx = e.clientX - ref.drag.startPointerX
    const dy = e.clientY - ref.drag.startPointerY

    if (ref.dragMode === "move") {
      dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect: computeMovePreview(ref.drag, dx, dy, config, snapX) })
    } else if (ref.dragMode === "resize-start") {
      dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect: computeResizeStartPreview(ref.drag, dx, config, snapX) })
    } else if (ref.dragMode === "resize-end") {
      dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect: computeResizeEndPreview(ref.drag, dx, config, snapX) })
    } else if (ref.dragMode === "strength") {
      const { rect, strength } = computeStrengthPreview(ref.drag, dy, config)
      dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect, strength })
    }
  }, [config, snapX, dispatch])

  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    const ref = dragRef.current
    if (!ref) return

    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)

    const dx = e.clientX - ref.drag.startPointerX
    const dy = e.clientY - ref.drag.startPointerY

    onUpdate(computeCommittedEvent(ref.dragMode, ref.drag, dx, dy, config))
    dragRef.current = null
    dispatch({ type: 'END_DRAG' })
  }, [config, onUpdate, dispatch])

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
