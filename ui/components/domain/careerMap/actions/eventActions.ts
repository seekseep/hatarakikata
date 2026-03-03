import type { CareerEvent } from "@/core/domain"

import type {
  AddEventAction,
  AddEventsAction,
  DeleteEventAction,
  DeleteEventsAction,
  ReplaceEventAction,
  SetEventsAction,
  UpdateEventAction,
} from "../hooks/EditorAction"

export function setEvents(events: CareerEvent[]): SetEventsAction {
  return { type: 'SET_EVENTS', events }
}

export function addEvent(event: CareerEvent): AddEventAction {
  return { type: 'ADD_EVENT', event }
}

export function addEvents(events: CareerEvent[]): AddEventsAction {
  return { type: 'ADD_EVENTS', events }
}

export function updateEvent(event: CareerEvent): UpdateEventAction {
  return { type: 'UPDATE_EVENT', event }
}

export function replaceEvent(tempId: string, event: CareerEvent): ReplaceEventAction {
  return { type: 'REPLACE_EVENT', tempId, event }
}

export function deleteEvent(eventId: string): DeleteEventAction {
  return { type: 'DELETE_EVENT', eventId }
}

export function deleteEvents(eventIds: string[]): DeleteEventsAction {
  return { type: 'DELETE_EVENTS', eventIds }
}
