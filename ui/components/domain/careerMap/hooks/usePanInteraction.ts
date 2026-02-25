"use client"

import { type RefObject,useCallback, useRef } from "react"

const PAN_THRESHOLD = 3

type PanState = {
  startX: number
  startY: number
  scrollLeft: number
  scrollTop: number
  isPanning: boolean
}

export function usePanInteraction(
  scrollRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLDivElement | null>,
  isDisabled: boolean,
) {
  const panRef = useRef<PanState | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isDisabled) return

    const scrollEl = scrollRef.current
    if (!scrollEl) return

    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollEl.scrollLeft,
      scrollTop: scrollEl.scrollTop,
      isPanning: false,
    }
  }, [isDisabled, scrollRef])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const pan = panRef.current
    if (!pan) return

    const dx = e.clientX - pan.startX
    const dy = e.clientY - pan.startY

    if (!pan.isPanning && (Math.abs(dx) > PAN_THRESHOLD || Math.abs(dy) > PAN_THRESHOLD)) {
      pan.isPanning = true
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing"
      }
    }

    if (pan.isPanning) {
      const scrollEl = scrollRef.current!
      scrollEl.scrollLeft = pan.scrollLeft - dx
      scrollEl.scrollTop = pan.scrollTop - dy
    }
  }, [scrollRef, canvasRef])

  const handlePointerUp = useCallback(() => {
    const wasPanning = panRef.current?.isPanning ?? false
    panRef.current = null

    if (canvasRef.current) {
      canvasRef.current.style.cursor = ""
    }

    return wasPanning
  }, [canvasRef])

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
