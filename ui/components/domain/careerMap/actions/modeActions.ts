import type {
  EnterIdleAction,
  EnterPlacementAction,
  SelectEventAction,
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
