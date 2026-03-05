import type { EditorMode } from "../../hooks/EditorState"
import type { TimelineConfig } from "../../utils/constants"
import type { Rect } from "../../utils/timelineMapping"
import { xToDate } from "../../utils/timelineMapping"

export function computeEventDisplayRect(
  eventId: string,
  originalRect: Rect,
  mode: EditorMode,
  previewRect: Rect | null,
): Rect {
  if (mode.type !== 'dragging' || !previewRect) return originalRect

  // Primary dragging event
  if (mode.drag.eventId === eventId) return previewRect

  // Additional dragging event (multi-select move)
  if (mode.dragMode === 'move') {
    const additionalEvent = mode.drag.additionalEvents.find(e => e.eventId === eventId)
    if (additionalEvent) {
      const dx = previewRect.x - mode.drag.startRect.x
      const dy = previewRect.y - mode.drag.startRect.y
      return { x: additionalEvent.startRect.x + dx, y: additionalEvent.startRect.y + dy, width: additionalEvent.startRect.width, height: additionalEvent.startRect.height }
    }
  }

  return originalRect
}

export function computeEventPreviewDates(
  eventId: string,
  mode: EditorMode,
  previewRect: Rect | null,
  config: TimelineConfig,
): { previewStartDate: string | undefined; previewEndDate: string | undefined } {
  if (mode.type !== 'dragging' || !previewRect) {
    return { previewStartDate: undefined, previewEndDate: undefined }
  }

  // Primary dragging event
  if (mode.drag.eventId === eventId) {
    return {
      previewStartDate: xToDate(previewRect.x, config),
      previewEndDate: xToDate(previewRect.x + previewRect.width, config),
    }
  }

  // Additional dragging event (multi-select move)
  if (mode.dragMode === 'move') {
    const additionalEvent = mode.drag.additionalEvents.find(e => e.eventId === eventId)
    if (additionalEvent) {
      const dx = previewRect.x - mode.drag.startRect.x
      return {
        previewStartDate: xToDate(additionalEvent.startRect.x + dx, config),
        previewEndDate: xToDate(additionalEvent.startRect.x + additionalEvent.startRect.width + dx, config),
      }
    }
  }

  return { previewStartDate: undefined, previewEndDate: undefined }
}
