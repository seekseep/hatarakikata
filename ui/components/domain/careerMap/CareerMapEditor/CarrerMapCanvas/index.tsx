"use client"

import React from "react"

import { openEditDialog, openQuestionAnswerDialog } from "../../actions/dialogActions"
import { hoverEvent, selectEvent, unhoverEvent } from "../../actions/modeActions"
import CareerMapEventItem from "../../CareerMapEventItem"
import CareerQuestionPlaceholderItem from "../../CareerQuestionPlaceholderItem"
import CarrerMapCanvasGrid from "../../CarrerMapCanvasGrid"
import CarrerMapCanvasItem from "../../CarrerMapCanvasItem"
import CarrerMapCanvasRuler from "../../CarrerMapCanvasRuler"
import { computeEventRect, computeQuestionRect } from "../../utils/timelineMapping"
import { computeEventDisplayRect, computeEventPreviewDates } from "./helpers"
import { useCarrerMapCanvas } from "./hooks"

export default function CarrerMapCanvas() {
  const {
    events,
    careerMap,
    timeline,
    scale,
    mode,
    hoveredEventId,
    openQuestionsWithPosition,
    scrollRef,
    canvasRef,
    canvasWidth,
    canvasHeight,
    rowHeight,
    isPlacement,
    selectedEventIds,
    previewRect,
    placeholderRect,
    dispatch,
    handleDragStart,
    handleCanvasPointerMove,
    handleCanvasPointerUp,
    handleCanvasClick,
  } = useCarrerMapCanvas()

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
        {careerMap?.startDate && careerMap?.endDate && (
          <>
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
          </>
        )}

        {/* Events */}
        {events.map((event) => {
          const rect = computeEventRect(event, timeline)
          const displayRect = computeEventDisplayRect(event.id, rect, mode, previewRect)
          const isDragging = rect !== displayRect
          const { previewStartDate, previewEndDate } = computeEventPreviewDates(event.id, mode, previewRect, timeline)

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
                previewStartDate={previewStartDate}
                previewEndDate={previewEndDate}
                isDragging={isDragging}
                isSelected={selectedEventIds.has(event.id)}
                isHovered={hoveredEventId === null ? null : hoveredEventId === event.id}
                rowHeight={rowHeight}
                onSelect={(e: React.MouseEvent) => dispatch(selectEvent(event.id, e.shiftKey))}
                onDragStart={(e, dragMode) => {
                  const additionalEvents = dragMode === 'move' && selectedEventIds.has(event.id) && selectedEventIds.size > 1
                    ? events
                        .filter(ev => selectedEventIds.has(ev.id) && ev.id !== event.id)
                        .map(ev => ({ eventId: ev.id, startRect: computeEventRect(ev, timeline), originalEvent: ev }))
                    : []
                  handleDragStart(e, dragMode, event, rect, additionalEvents)
                }}
                onEdit={() => dispatch(openEditDialog(event))}
                onPointerEnter={() => dispatch(hoverEvent(event.id))}
                onPointerLeave={() => dispatch(unhoverEvent())}
              />
            </CarrerMapCanvasItem>
          )
        })}

        {/* Question placeholders */}
        {openQuestionsWithPosition.map((question) => {
          const rect = computeQuestionRect(question, timeline)
          return (
            <CarrerMapCanvasItem
              key={`question-${question.id}`}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
            >
              <CareerQuestionPlaceholderItem
                question={question}
                onClick={() => dispatch(openQuestionAnswerDialog(question))}
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
