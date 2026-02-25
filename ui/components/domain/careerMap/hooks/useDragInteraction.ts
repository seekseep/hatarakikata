"use client"

import { useCallback, useReducer, useRef } from "react"

import type { CareerEvent } from "@/core/domain"

import type { TimelineConfig } from "../utils/constants"
import { dateToX, type Rect, xToDate, yToRow } from "../utils/timelineMapping"

export type DragMode = "move" | "resize-start" | "resize-end" | "strength"

type DragState = {
  mode: DragMode
  eventId: string
  startPointerX: number
  startPointerY: number
  startRect: Rect
  originalEvent: CareerEvent
}

// --- State & Action ---

type State = {
  dragState: DragState | null
  previewRect: Rect | null
  previewStrength: number | null
}

type Action =
  | { type: "start"; dragState: DragState; rect: Rect; strength: number }
  | { type: "preview"; rect: Rect; strength?: number }
  | { type: "end" }

const initialState: State = {
  dragState: null,
  previewRect: null,
  previewStrength: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { dragState: action.dragState, previewRect: action.rect, previewStrength: action.strength }
    case "preview":
      return { ...state, previewRect: action.rect, previewStrength: action.strength ?? state.previewStrength }
    case "end":
      return initialState
  }
}

// --- Preview 計算（純粋関数） ---

function computeMovePreview(
  dragState: DragState,
  dx: number,
  dy: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect, originalEvent } = dragState
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

function computeResizeStartPreview(
  dragState: DragState,
  dx: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect } = dragState
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
  dragState: DragState,
  dx: number,
  config: TimelineConfig,
  snapX: (x: number) => number,
): Rect {
  const { startRect } = dragState
  const snappedEndX = snapX(startRect.x + startRect.width + dx)
  return {
    x: startRect.x,
    y: startRect.y,
    width: Math.max(snappedEndX - startRect.x, config.unit),
    height: startRect.height,
  }
}

function computeStrengthPreview(
  dragState: DragState,
  dy: number,
  config: TimelineConfig,
): { rect: Rect; strength: number } {
  const { startRect, originalEvent } = dragState
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

function computeCommittedEvent(
  dragState: DragState,
  dx: number,
  dy: number,
  config: TimelineConfig,
): CareerEvent {
  const { mode, originalEvent, startRect } = dragState
  const rowStep = (config.rowHeightInUnits + config.rowGapHeightInUnits) * config.unit

  if (mode === "move") {
    const newStartX = startRect.x + dx
    const newEndX = newStartX + startRect.width
    return {
      ...originalEvent,
      startDate: xToDate(newStartX, config),
      endDate: xToDate(newEndX, config),
      row: yToRow(startRect.y + dy, config),
    }
  }

  if (mode === "resize-start") {
    const newWidth = Math.max(startRect.width - dx, config.unit)
    const newX = startRect.x + startRect.width - newWidth
    return { ...originalEvent, startDate: xToDate(newX, config) }
  }

  if (mode === "resize-end") {
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

export function useDragInteraction(
  config: TimelineConfig,
  onUpdate: (event: CareerEvent) => void,
) {
  const [{ dragState, previewRect, previewStrength }, dispatch] = useReducer(reducer, initialState)
  const dragStateRef = useRef<DragState | null>(null)

  const handlePointerDown = useCallback((
    e: React.PointerEvent,
    mode: DragMode,
    event: CareerEvent,
    rect: Rect,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    const state: DragState = {
      mode,
      eventId: event.id,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startRect: rect,
      originalEvent: event,
    }
    dragStateRef.current = state
    dispatch({ type: "start", dragState: state, rect, strength: event.strength ?? 3 })
  }, [])

  const snapX = useCallback((x: number) => {
    return dateToX(xToDate(x, config), config)
  }, [config])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = dragStateRef.current
    if (!state) return

    const dx = e.clientX - state.startPointerX
    const dy = e.clientY - state.startPointerY

    if (state.mode === "move") {
      dispatch({ type: "preview", rect: computeMovePreview(state, dx, dy, config, snapX) })
    } else if (state.mode === "resize-start") {
      dispatch({ type: "preview", rect: computeResizeStartPreview(state, dx, config, snapX) })
    } else if (state.mode === "resize-end") {
      dispatch({ type: "preview", rect: computeResizeEndPreview(state, dx, config, snapX) })
    } else if (state.mode === "strength") {
      const { rect, strength } = computeStrengthPreview(state, dy, config)
      dispatch({ type: "preview", rect, strength })
    }
  }, [config, snapX])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = dragStateRef.current
    if (!state) return

    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)

    const dx = e.clientX - state.startPointerX
    const dy = e.clientY - state.startPointerY

    onUpdate(computeCommittedEvent(state, dx, dy, config))
    dragStateRef.current = null
    dispatch({ type: "end" })
  }, [config, onUpdate])

  return {
    dragState,
    previewRect,
    previewStrength,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
