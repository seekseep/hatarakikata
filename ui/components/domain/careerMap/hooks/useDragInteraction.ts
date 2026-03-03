"use client"

import { useCallback, useRef } from "react"

import type { CareerEvent } from "@/core/domain"

import type { TimelineConfig } from "../utils/constants"
import { dateToX, type Rect, xToDate, yToRow } from "../utils/timelineMapping"
import type { EditorAction } from "./EditorAction"
import type { DraggedEventInfo, DragMode, DragPayload } from "./EditorState"

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

const DRAG_THRESHOLD = 3

type PendingDragRef = {
  phase: 'pending'
  dragMode: DragMode
  event: CareerEvent
  rect: Rect
  startX: number
  startY: number
  pointerId: number
  additionalEvents: DraggedEventInfo[]
}

type ActiveDragRef = {
  phase: 'dragging'
  dragMode: DragMode
  drag: DragPayload
}

type DragRefState = PendingDragRef | ActiveDragRef

export function useDragInteraction(
  config: TimelineConfig,
  dispatch: React.Dispatch<EditorAction>,
  onUpdate: (event: CareerEvent) => void,
) {
  const dragRef = useRef<DragRefState | null>(null)

  const handleDragStart = useCallback((
    e: React.PointerEvent,
    dragMode: DragMode,
    event: CareerEvent,
    rect: Rect,
    additionalEvents: DraggedEventInfo[] = [],
  ) => {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    dragRef.current = {
      phase: 'pending',
      dragMode,
      event,
      rect,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      additionalEvents,
    }
  }, [])

  const snapX = useCallback((x: number) => {
    return dateToX(xToDate(x, config), config)
  }, [config])

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    const ref = dragRef.current
    if (!ref) return

    if (ref.phase === 'pending') {
      const dx = e.clientX - ref.startX
      const dy = e.clientY - ref.startY
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return

      // Transition to actual drag
      const drag: DragPayload = {
        eventId: ref.event.id,
        startPointerX: ref.startX,
        startPointerY: ref.startY,
        startRect: ref.rect,
        originalEvent: ref.event,
        additionalEvents: ref.additionalEvents,
      }
      dragRef.current = { phase: 'dragging', dragMode: ref.dragMode, drag }
      dispatch({ type: 'START_DRAG', dragMode: ref.dragMode, drag, rect: ref.rect, strength: ref.event.strength ?? 3 })

      // Compute preview for this move
      if (ref.dragMode === "move") {
        dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect: computeMovePreview(drag, dx, dy, config, snapX) })
      } else if (ref.dragMode === "resize-start") {
        dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect: computeResizeStartPreview(drag, dx, config, snapX) })
      } else if (ref.dragMode === "resize-end") {
        dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect: computeResizeEndPreview(drag, dx, config, snapX) })
      } else if (ref.dragMode === "strength") {
        const { rect, strength } = computeStrengthPreview(drag, dy, config)
        dispatch({ type: 'UPDATE_DRAG_PREVIEW', rect, strength })
      }
      return
    }

    // phase === 'dragging'
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

    if (ref.phase === 'pending') {
      // No drag happened — clean up and let click handle selection
      dragRef.current = null
      return
    }

    // phase === 'dragging'
    const dx = e.clientX - ref.drag.startPointerX
    const dy = e.clientY - ref.drag.startPointerY

    // Commit primary event
    onUpdate(computeCommittedEvent(ref.dragMode, ref.drag, dx, dy, config))

    // Commit additional events (multi-drag, move only)
    if (ref.dragMode === 'move' && ref.drag.additionalEvents.length > 0) {
      for (const ae of ref.drag.additionalEvents) {
        const aeDrag: DragPayload = {
          eventId: ae.eventId,
          startPointerX: ref.drag.startPointerX,
          startPointerY: ref.drag.startPointerY,
          startRect: ae.startRect,
          originalEvent: ae.originalEvent,
          additionalEvents: [],
        }
        onUpdate(computeCommittedEvent('move', aeDrag, dx, dy, config))
      }
    }

    // Preserve selection after multi-drag
    const selectedEventIds = ref.drag.additionalEvents.length > 0
      ? new Set([ref.drag.eventId, ...ref.drag.additionalEvents.map(ae => ae.eventId)])
      : undefined

    dragRef.current = null
    dispatch({ type: 'END_DRAG', selectedEventIds })
  }, [config, onUpdate, dispatch])

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
