import type {
  EndDragAction,
  StartDragAction,
  UpdateDragPreviewAction,
} from "../hooks/EditorAction"
import type { DragMode, DragPayload } from "../hooks/EditorState"
import type { Rect } from "../utils/timelineMapping"

export function startDrag(dragMode: DragMode, drag: DragPayload, rect: Rect, strength: number): StartDragAction {
  return { type: 'START_DRAG', dragMode, drag, rect, strength }
}

export function updateDragPreview(rect: Rect, strength?: number): UpdateDragPreviewAction {
  return { type: 'UPDATE_DRAG_PREVIEW', rect, strength }
}

export function endDrag(): EndDragAction {
  return { type: 'END_DRAG' }
}
