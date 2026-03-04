import type { CareerEvent } from "@/core/domain"

import type { EditorAction } from "./EditorAction"
import type { Rect } from "../utils/timelineMapping"

// --- CreatePrefill (moved from useCarrerMapEditor.ts) ---

export type CreatePrefill = {
  row?: number
  startDate: string
  endDate: string
}

// --- Drag types (moved from useDragInteraction.ts) ---

export type DragMode = "move" | "resize-start" | "resize-end" | "strength"

export type DraggedEventInfo = {
  eventId: string
  startRect: Rect
  originalEvent: CareerEvent
}

export type DragPayload = {
  eventId: string
  startPointerX: number
  startPointerY: number
  startRect: Rect
  originalEvent: CareerEvent
  additionalEvents: DraggedEventInfo[]
}

// --- Editor Mode (discriminated union) ---

export type IdleMode = { type: 'idle' }
export type SelectedMode = { type: 'selected'; selectedEventIds: Set<string> }
export type DraggingMode = { type: 'dragging'; dragMode: DragMode; drag: DragPayload; previewRect: Rect; previewStrength: number }
export type PlacementMode = { type: 'placement' }
export type CreateDialogMode = { type: 'create-dialog'; prefill?: CreatePrefill }
export type EditDialogMode = { type: 'edit-dialog'; event: CareerEvent }
export type GenerateDialogMode = { type: 'generate-dialog' }
export type SearchDrawerMode = { type: 'search-drawer' }
export type JsonImportDialogMode = { type: 'json-import-dialog' }
export type ViewerMode = { type: 'viewer'; careerMapId: string; userName?: string }
export type QuestionsDrawerMode = { type: 'questions-drawer' }
export type ConfirmDialogMode = { type: 'confirm-dialog'; message: string; confirmAction: EditorAction }
export type CareerGuidePromptDialogMode = { type: 'career-guide-prompt-dialog' }
export type CareerGuidesDrawerMode = { type: 'career-guides-drawer' }
export type CareerGuideDetailDrawerMode = { type: 'career-guide-detail-drawer'; guideId: string }

export type EditorMode =
  | IdleMode
  | SelectedMode
  | DraggingMode
  | PlacementMode
  | CreateDialogMode
  | EditDialogMode
  | GenerateDialogMode
  | SearchDrawerMode
  | JsonImportDialogMode
  | ViewerMode
  | QuestionsDrawerMode
  | ConfirmDialogMode
  | CareerGuidePromptDialogMode
  | CareerGuidesDrawerMode
  | CareerGuideDetailDrawerMode

// --- Editor State ---

export type EditorState = {
  events: CareerEvent[]
  mode: EditorMode
  hoveredEventId: string | null
}

export const initialEditorState: EditorState = {
  events: [],
  mode: { type: 'idle' },
  hoveredEventId: null,
}
