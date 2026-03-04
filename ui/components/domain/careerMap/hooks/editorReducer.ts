import type { EditorAction } from "./EditorAction"
import type { EditorState } from "./EditorState"

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // --- Event mutations ---

    case 'SET_EVENTS':
      return { ...state, events: action.events }

    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.event] }

    case 'ADD_EVENTS':
      return { ...state, events: [...state.events, ...action.events] }

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e => e.id === action.event.id ? action.event : e),
      }

    case 'REPLACE_EVENT':
      return {
        ...state,
        events: state.events.map(e => e.id === action.tempId ? action.event : e),
      }

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(e => e.id !== action.eventId),
      }

    case 'DELETE_EVENTS':
      return {
        ...state,
        events: state.events.filter(e => !action.eventIds.includes(e.id)),
        mode: { type: 'idle' },
      }

    // --- Mode transitions ---

    case 'ENTER_IDLE':
      return { ...state, mode: { type: 'idle' } }

    case 'SELECT_EVENT': {
      if (state.mode.type === 'selected' && action.shiftKey) {
        const next = new Set(state.mode.selectedEventIds)
        if (next.has(action.eventId)) {
          next.delete(action.eventId)
        } else {
          next.add(action.eventId)
        }
        return { ...state, mode: { type: 'selected', selectedEventIds: next } }
      }
      return { ...state, mode: { type: 'selected', selectedEventIds: new Set([action.eventId]) } }
    }

    case 'START_DRAG':
      return {
        ...state,
        mode: {
          type: 'dragging',
          dragMode: action.dragMode,
          drag: action.drag,
          previewRect: action.rect,
          previewStrength: action.strength,
        },
      }

    case 'UPDATE_DRAG_PREVIEW': {
      if (state.mode.type !== 'dragging') return state
      return {
        ...state,
        mode: {
          ...state.mode,
          previewRect: action.rect,
          previewStrength: action.strength ?? state.mode.previewStrength,
        },
      }
    }

    case 'END_DRAG':
      if (action.selectedEventIds && action.selectedEventIds.size > 0) {
        return { ...state, mode: { type: 'selected', selectedEventIds: action.selectedEventIds } }
      }
      return { ...state, mode: { type: 'idle' } }

    case 'ENTER_PLACEMENT':
      return { ...state, mode: { type: 'placement' } }

    case 'OPEN_CREATE_DIALOG':
      return { ...state, mode: { type: 'create-dialog', prefill: action.prefill } }

    case 'OPEN_EDIT_DIALOG':
      return { ...state, mode: { type: 'edit-dialog', event: action.event } }

    case 'OPEN_GENERATE_DIALOG':
      return { ...state, mode: { type: 'generate-dialog' } }

    case 'OPEN_SEARCH_DRAWER':
      return { ...state, mode: { type: 'search-drawer' } }

    case 'OPEN_JSON_IMPORT_DIALOG':
      return { ...state, mode: { type: 'json-import-dialog' } }

    case 'OPEN_VIEWER':
      return { ...state, mode: { type: 'viewer', careerMapId: action.careerMapId, userName: action.userName } }

    case 'OPEN_QUESTIONS_DRAWER':
      return { ...state, mode: { type: 'questions-drawer' } }

    case 'OPEN_CONFIRM_DIALOG':
      return { ...state, mode: { type: 'confirm-dialog', message: action.message, confirmAction: action.confirmAction } }

    case 'REQUEST_CREATE_CAREER_GUIDE':
      return { ...state, mode: { type: 'idle' } }

    case 'OPEN_CAREER_GUIDE_PROMPT_DIALOG':
      return { ...state, mode: { type: 'career-guide-prompt-dialog' } }

    case 'OPEN_CAREER_GUIDES_DRAWER':
      return { ...state, mode: { type: 'career-guides-drawer' } }

    case 'OPEN_CAREER_GUIDE_DETAIL_DRAWER':
      return { ...state, mode: { type: 'career-guide-detail-drawer', guideId: action.guideId } }

    case 'CLOSE_DIALOG':
      return { ...state, mode: { type: 'idle' } }

    // --- Hover ---

    case 'HOVER_EVENT':
      return { ...state, hoveredEventId: action.eventId }

    case 'UNHOVER_EVENT':
      return { ...state, hoveredEventId: null }
  }
}
