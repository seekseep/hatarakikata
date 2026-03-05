"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useCareerQuestionsQuery } from "@/ui/hooks/careerQuestion"

import { openCreateDialog } from "../../actions/dialogActions"
import { enterIdle } from "../../actions/modeActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import { SCALE_DISPLAY_CONFIG } from "../../utils/constants"
import { computeCanvasHeight, computeCanvasWidth, computeMaxEventBottom, computePlaceholderRect, xToDate, yToRow } from "../../utils/timelineMapping"

export function useCarrerMapCanvas() {
  const { state: { events, careerMap, timelineConfig: config, scale, mode, hoveredEventId }, dispatch, deleteEvent, handleDragStart, handleDragMove, handleDragEnd } = useCarrerMapEditorContext()

  const questionsQuery = useCareerQuestionsQuery()
  const openQuestionsWithPosition = useMemo(() =>
    (questionsQuery.data ?? []).filter(
      (q): q is typeof q & { startDate: string; endDate: string } =>
        q.status === "open" && !!q.startDate && !!q.endDate
    ),
    [questionsQuery.data]
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const canvasWidth = computeCanvasWidth(config)
  const headerPx = config.headerHeightInUnits * config.unit
  const rowHeight = config.rowHeightInUnits * config.unit

  const maxEventBottom = useMemo(() =>
    computeMaxEventBottom(events, openQuestionsWithPosition, config),
    [events, config, openQuestionsWithPosition]
  )

  const canvasHeight = computeCanvasHeight(headerPx, maxEventBottom, rowHeight)

  // --- Derived from mode ---
  const isPlacement = mode.type === 'placement'
  const selectedEventIds = useMemo(() => mode.type === 'selected' ? mode.selectedEventIds : new Set<string>(), [mode])
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
          dispatch(enterIdle())
          setPlaceholderRect(null)
          return
        }
        if (selectedEventIds.size === 0) return
        e.preventDefault()
        dispatch(enterIdle())
        return
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
        if (selectedEventIds.size === 0) return
        e.preventDefault()
        for (const eventId of selectedEventIds) {
          deleteEvent(eventId)
        }
        dispatch(enterIdle())
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

    setPlaceholderRect(computePlaceholderRect(canvasX, canvasY, tickWidthPx, config))
  }, [handleDragMove, isPlacement, headerPx, tickWidthPx, config])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isPlacement) {
      if (!placeholderRect) return
      const startDate = xToDate(placeholderRect.x, config)
      const endDate = xToDate(placeholderRect.x + placeholderRect.width, config)
      const canvasEl = canvasRef.current
      if (!canvasEl) return
      const rect = canvasEl.getBoundingClientRect()
      const canvasY = e.clientY - rect.top
      const row = yToRow(canvasY, config)

      dispatch(openCreateDialog({ row, startDate, endDate }))
      setPlaceholderRect(null)
      return
    }
    // Deselect when clicking empty canvas area
    dispatch(enterIdle())
  }, [isPlacement, placeholderRect, config, dispatch])

  const handleCanvasPointerUp = useCallback((e: React.PointerEvent) => {
    handleDragEnd(e)
  }, [handleDragEnd])

  return {
    // State
    events,
    careerMap,
    config,
    scale,
    mode,
    hoveredEventId,
    openQuestionsWithPosition,
    // Refs
    scrollRef,
    canvasRef,
    // Computed
    canvasWidth,
    canvasHeight,
    rowHeight,
    isPlacement,
    selectedEventIds,
    previewRect,
    placeholderRect,
    // Handlers
    dispatch,
    handleDragStart,
    handleCanvasPointerMove,
    handleCanvasPointerUp,
    handleCanvasClick,
  }
}
