import type { EditorMode } from "../../hooks/EditorState"
import type { Rect } from "../../utils/timelineMapping"
import { xToDate } from "../../utils/timelineMapping"
import type { TimelineConfig } from "../../utils/constants"

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
    const ae = mode.drag.additionalEvents.find(ae => ae.eventId === eventId)
    if (ae) {
      const dx = previewRect.x - mode.drag.startRect.x
      const dy = previewRect.y - mode.drag.startRect.y
      return { x: ae.startRect.x + dx, y: ae.startRect.y + dy, width: ae.startRect.width, height: ae.startRect.height }
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
    const ae = mode.drag.additionalEvents.find(ae => ae.eventId === eventId)
    if (ae) {
      const dx = previewRect.x - mode.drag.startRect.x
      return {
        previewStartDate: xToDate(ae.startRect.x + dx, config),
        previewEndDate: xToDate(ae.startRect.x + ae.startRect.width + dx, config),
      }
    }
  }

  return { previewStartDate: undefined, previewEndDate: undefined }
}
