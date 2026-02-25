"use client"

import { useMemo, useRef } from "react"

import type { CareerEvent, CareerMap } from "@/core/domain"

import CareerMapEventItem from "../CareerMapEventItem"
import CarrerMapCanvasGrid from "../CarrerMapCanvasGrid"
import CarrerMapCanvasItem from "../CarrerMapCanvasItem"
import CarrerMapCanvasRuler from "../CarrerMapCanvasRuler"
import { usePanInteraction } from "../hooks/usePanInteraction"
import type { TimelineConfig } from "../utils/constants"
import { computeCanvasWidth, eventToRect } from "../utils/timelineMapping"

type CareerMapViewCanvasProps = {
  careerMap: CareerMap & { startDate: string }
  events: CareerEvent[]
  timelineConfig: TimelineConfig
  scale: number
  onEventClick?: (event: CareerEvent) => void
}

export default function CareerMapViewCanvas({ careerMap, events, timelineConfig: config, scale, onEventClick }: CareerMapViewCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    usePanInteraction(scrollRef, canvasRef, false)

  const canvasWidth = computeCanvasWidth(config)
  const headerPx = config.headerHeightInUnits * config.unit
  const rowHeight = config.rowHeightInUnits * config.unit

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

  return (
    <div ref={scrollRef} className="w-full h-full overflow-auto relative">
      <div
        ref={canvasRef}
        className="cursor-grab"
        style={{ width: canvasWidth, minHeight: "100%", height: canvasHeight, position: "relative" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <CarrerMapCanvasRuler
          startDate={careerMap.startDate}
          endDate={careerMap.endDate}
          scale={scale}
        />

        <CarrerMapCanvasGrid
          startDate={careerMap.startDate}
          endDate={careerMap.endDate}
          scale={scale}
          canvasHeight={canvasHeight}
        />

        {events.map((event) => {
          const rect = eventToRect(event, config)
          const isPoint = event.startDate === event.endDate

          const pointSize = config.rowHeightInUnits * config.unit
          const pointRect = isPoint
            ? { x: rect.x + config.unit / 2 - pointSize / 2, y: rect.y, width: pointSize, height: pointSize }
            : rect
          const displayRect = isPoint ? pointRect : rect

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
                isDragging={false}
                isSelected={false}
                readOnly
                rowHeight={rowHeight}
                onSelect={(e) => { e.stopPropagation(); onEventClick?.(event) }}
              />
            </CarrerMapCanvasItem>
          )
        })}
      </div>
    </div>
  )
}
