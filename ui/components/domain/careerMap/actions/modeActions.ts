import type {
  EnterIdleAction,
  EnterPlacementAction,
  HoverEventAction,
  SelectEventAction,
  UnhoverEventAction,
} from "../hooks/EditorAction"

export function enterIdle(): EnterIdleAction {
  return { type: 'ENTER_IDLE' }
}

export function selectEvent(eventId: string, shiftKey: boolean): SelectEventAction {
  return { type: 'SELECT_EVENT', eventId, shiftKey }
}

export function enterPlacement(): EnterPlacementAction {
  return { type: 'ENTER_PLACEMENT' }
}

export function hoverEvent(eventId: string): HoverEventAction {
  return { type: 'HOVER_EVENT', eventId }
}

export function unhoverEvent(): UnhoverEventAction {
  return { type: 'UNHOVER_EVENT' }
}
