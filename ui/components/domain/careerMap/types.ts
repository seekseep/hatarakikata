import type { CareerEvent } from "@/core/domain"

import type { DraggedEventInfo, DragMode, DragPayload } from "./hooks/EditorState"
import type { Rect } from "./utils/timelineMapping"

export type PendingDragRef = {
  phase: 'pending'
  dragMode: DragMode
  event: CareerEvent
  rect: Rect
  startX: number
  startY: number
  pointerId: number
  additionalEvents: DraggedEventInfo[]
}

export type ActiveDragRef = {
  phase: 'dragging'
  dragMode: DragMode
  drag: DragPayload
}

export type DragRefState = PendingDragRef | ActiveDragRef
