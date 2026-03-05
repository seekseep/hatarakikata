"use client"

import { useCallback, useRef } from "react"

import type { CareerEvent } from "@/core/domain"

import { endDrag, startDrag, updateDragPreview } from "../actions/dragActions"
import { DRAG_THRESHOLD } from "../constants"
import type { DragRefState } from "../types"
import { SCALE_DISPLAY_CONFIG, type TimelineConfig } from "../utils/constants"
import { computeHeight, computeRowY, type Rect, xToDate, yToRow } from "../utils/timelineMapping"
import type { EditorAction } from "./EditorAction"
import type { DraggedEventInfo, DragMode, DragPayload } from "./EditorState"

function computeMovePreview(
  drag: DragPayload,
  dx: number,
  dy: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect, originalEvent } = drag

  const snappedStartX = snapX(startRect.x + dx)
  const newRow = yToRow(startRect.y + dy, config)
  const strength = originalEvent.strength ?? 3

  return {
    x: snappedStartX,
    y: computeRowY(newRow, config),
    width: startRect.width,
    height: computeHeight(strength, config),
  }
}

function computeResizeStartPreview(
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

function computeResizeEndPreview(
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

function computeStrengthPreview(
  drag: DragPayload,
  dy: number,
  config: TimelineConfig,
): { rect: Rect; strength: number } {
  const { startRect, originalEvent } = drag
  const rowStep = (config.rowHeightInUnits + config.rowGapHeightInUnits) * config.unit

  const currentStrength = originalEvent.strength ?? 3
  const strengthDelta = dy / rowStep
  const strength = Math.round(Math.min(config.maxStrength, Math.max(1, currentStrength + strengthDelta)))

  return { rect: { x: startRect.x, y: startRect.y, width: startRect.width, height: computeHeight(strength, config) }, strength }
}

function computeCommittedEvent(
  dragMode: DragMode,
  drag: DragPayload,
  dx: number,
  dy: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): CareerEvent {
  const { originalEvent, startRect } = drag
  const rowStep = (config.rowHeightInUnits + config.rowGapHeightInUnits) * config.unit

  if (dragMode === "move") {
    const newStartX = snapX(startRect.x + dx)
    const newEndX = newStartX + startRect.width
    return {
      ...originalEvent,
      startDate: xToDate(newStartX, config),
      endDate: xToDate(newEndX, config),
      row: yToRow(startRect.y + dy, config),
    }
  }

  if (dragMode === "resize-start") {
    const snappedX = snapX(startRect.x + dx)
    const endX = startRect.x + startRect.width
    const newWidth = Math.max(endX - snappedX, config.unit)
    const newX = endX - newWidth
    return { ...originalEvent, startDate: xToDate(newX, config) }
  }

  if (dragMode === "resize-end") {
    const snappedEndX = snapX(startRect.x + startRect.width + dx)
    const newWidth = Math.max(snappedEndX - startRect.x, config.unit)
    return { ...originalEvent, endDate: xToDate(startRect.x + newWidth, config) }
  }

  // strength
  const currentStrength = originalEvent.strength ?? 3
  const strengthDelta = dy / rowStep
  const newStrength = Math.round(Math.min(config.maxStrength, Math.max(1, currentStrength + strengthDelta)))
  return { ...originalEvent, strength: newStrength }
}

// --- Hook ---

export function useDragInteraction(
  config: TimelineConfig,
  scale: number,
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

  const snapPx = SCALE_DISPLAY_CONFIG[scale - 1].tickWidthPx / 4

  const snapX = useCallback((x: number) => {
    return Math.round(x / snapPx) * snapPx
  }, [snapPx])

  const dispatchPreview = useCallback((dragMode: DragMode, drag: DragPayload, dx: number, dy: number) => {
    switch (dragMode) {
      case "move":
        dispatch(updateDragPreview(computeMovePreview(drag, dx, dy, config, snapX)))
        break
      case "resize-start":
        dispatch(updateDragPreview(computeResizeStartPreview(drag, dx, config, snapX)))
        break
      case "resize-end":
        dispatch(updateDragPreview(computeResizeEndPreview(drag, dx, config, snapX)))
        break
      case "strength": {
        const { rect, strength } = computeStrengthPreview(drag, dy, config)
        dispatch(updateDragPreview(rect, strength))
        break
      }
    }
  }, [config, snapX, dispatch])

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
      dispatch(startDrag(ref.dragMode, drag, ref.rect, ref.event.strength ?? 3))

      dispatchPreview(ref.dragMode, drag, dx, dy)
      return
    }

    // phase === 'dragging'
    const dx = e.clientX - ref.drag.startPointerX
    const dy = e.clientY - ref.drag.startPointerY

    dispatchPreview(ref.dragMode, ref.drag, dx, dy)
  }, [dispatch, dispatchPreview])

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
    onUpdate(computeCommittedEvent(ref.dragMode, ref.drag, dx, dy, config, snapX))

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
        onUpdate(computeCommittedEvent('move', aeDrag, dx, dy, config, snapX))
      }
    }

    // Preserve selection after multi-drag
    const selectedEventIds = ref.drag.additionalEvents.length > 0
      ? new Set([ref.drag.eventId, ...ref.drag.additionalEvents.map(ae => ae.eventId)])
      : undefined

    dragRef.current = null
    dispatch(endDrag(selectedEventIds))
  }, [config, snapX, onUpdate, dispatch])

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
