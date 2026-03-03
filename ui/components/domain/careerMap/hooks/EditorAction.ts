import type { CareerEvent } from "@/core/domain"

import type { Rect } from "../utils/timelineMapping"
import type { CreatePrefill, DragMode, DragPayload } from "./EditorState"

// --- Event Actions ---

export type SetEventsAction = { type: 'SET_EVENTS'; events: CareerEvent[] }

export type AddEventAction = { type: 'ADD_EVENT'; event: CareerEvent }

export type AddEventsAction = { type: 'ADD_EVENTS'; events: CareerEvent[] }

export type UpdateEventAction = { type: 'UPDATE_EVENT'; event: CareerEvent }

export type ReplaceEventAction = { type: 'REPLACE_EVENT'; tempId: string; event: CareerEvent }

export type DeleteEventAction = { type: 'DELETE_EVENT'; eventId: string }

export type DeleteEventsAction = { type: 'DELETE_EVENTS'; eventIds: string[] }

// --- Mode Transition Actions ---

export type EnterIdleAction = { type: 'ENTER_IDLE' }

export type SelectEventAction = { type: 'SELECT_EVENT'; eventId: string; shiftKey: boolean }

export type StartDragAction = { type: 'START_DRAG'; dragMode: DragMode; drag: DragPayload; rect: Rect; strength: number }

export type UpdateDragPreviewAction = { type: 'UPDATE_DRAG_PREVIEW'; rect: Rect; strength?: number }

export type EndDragAction = { type: 'END_DRAG' }

export type EnterPlacementAction = { type: 'ENTER_PLACEMENT' }

export type OpenCreateDialogAction = { type: 'OPEN_CREATE_DIALOG'; prefill?: CreatePrefill }

export type OpenEditDialogAction = { type: 'OPEN_EDIT_DIALOG'; event: CareerEvent }

export type OpenGenerateDialogAction = { type: 'OPEN_GENERATE_DIALOG' }

export type OpenSearchDialogAction = { type: 'OPEN_SEARCH_DIALOG' }

export type OpenJsonImportDialogAction = { type: 'OPEN_JSON_IMPORT_DIALOG' }

export type OpenViewerAction = { type: 'OPEN_VIEWER'; careerMapId: string }

export type CloseDialogAction = { type: 'CLOSE_DIALOG' }

// --- Union ---

export type EditorAction =
  | SetEventsAction
  | AddEventAction
  | AddEventsAction
  | UpdateEventAction
  | ReplaceEventAction
  | DeleteEventAction
  | DeleteEventsAction
  | EnterIdleAction
  | SelectEventAction
  | StartDragAction
  | UpdateDragPreviewAction
  | EndDragAction
  | EnterPlacementAction
  | OpenCreateDialogAction
  | OpenEditDialogAction
  | OpenGenerateDialogAction
  | OpenSearchDialogAction
  | OpenJsonImportDialogAction
  | OpenViewerAction
  | CloseDialogAction
