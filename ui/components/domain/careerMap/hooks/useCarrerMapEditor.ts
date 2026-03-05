"use client"

import { useCallback, useEffect, useMemo, useReducer, useState } from "react"

import type { CareerEvent, CareerEventPayload, CareerMap } from "@/core/domain"
import type {
  useCareerEventsByCareerMapIdQuery,
  useCreateCareerEventMutation,
  useDeleteCareerEventMutation,
  useUpdateCareerEventMutation,
} from "@/ui/hooks/careerEvent"
import type { useCareerMapQuery, useUpdateCareerMapMutation } from "@/ui/hooks/careerMap"

import { addEvent, deleteEvent as deleteEventAction, replaceEvent, setEvents, updateEvent as updateEventAction } from "../actions/eventActions"
import { DEFAULT_TIMELINE_CONFIG, SCALE_DEFAULT, SCALE_MONTH_WIDTH_PX, type TimelineConfig } from "../utils/constants"
import type { Rect } from "../utils/timelineMapping"
import { computeHeaderHeightInUnits, computeTimelineConfig } from "../utils/timelineMapping"
import type { EditorAction } from "./EditorAction"
import { editorReducer } from "./editorReducer"
import type { DraggedEventInfo, DragMode, EditorMode } from "./EditorState"
import { initialEditorState } from "./EditorState"
import { useDragInteraction } from "./useDragInteraction"

export type CarrerMapEditorStatus = 'loading' | 'ready' | 'error'

function isNotFound(error: unknown): boolean {
  return !!error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404
}

// Re-export for consumers
export type { CreatePrefill } from "./EditorState"

export type UseCarrerMapEditorOptions = {
  careerMapId: string
  careerMapQuery: ReturnType<typeof useCareerMapQuery>
  careerEventsQuery: ReturnType<typeof useCareerEventsByCareerMapIdQuery>
  updateCareerMapMutation: ReturnType<typeof useUpdateCareerMapMutation>
  createCareerEventMutation: ReturnType<typeof useCreateCareerEventMutation>
  updateCareerEventMutation: ReturnType<typeof useUpdateCareerEventMutation>
  deleteCareerEventMutation: ReturnType<typeof useDeleteCareerEventMutation>
}

export type CarrerMapEditorStoreState = {
  status: CarrerMapEditorStatus
  careerMapId: string
  careerMap: CareerMap | undefined
  events: CareerEvent[]
  mode: EditorMode
  timelineConfig: TimelineConfig
  error: Error | undefined
  scale: number
  hoveredEventId: string | null
}

export type CarrerMapEditorStore = {
  state: CarrerMapEditorStoreState
  dispatch: React.Dispatch<EditorAction>
  setScale: (scale: number) => void
  updateCareerMap: (updates: Partial<Pick<CareerMap, "startDate">>) => void
  createEvent: (payload: CareerEventPayload) => void
  createEventAsync: (payload: CareerEventPayload) => Promise<CareerEvent>
  updateEvent: (event: CareerEvent) => void
  deleteEvent: (eventId: string) => void
  handleDragStart: (e: React.PointerEvent, dragMode: DragMode, event: CareerEvent, rect: Rect, additionalEvents?: DraggedEventInfo[]) => void
  handleDragMove: (e: React.PointerEvent) => void
  handleDragEnd: (e: React.PointerEvent) => void
}

export function useCarrerMapEditor(options: UseCarrerMapEditorOptions): CarrerMapEditorStore {
  const {
    careerMapId,
    careerMapQuery,
    careerEventsQuery,
    updateCareerMapMutation,
    createCareerEventMutation,
    updateCareerEventMutation,
    deleteCareerEventMutation,
  } = options

  const careerMap = careerMapQuery.data

  // --- Reducer ---
  const [editorState, dispatch] = useReducer(editorReducer, initialEditorState)

  // --- Independent state (orthogonal to mode) ---
  const [error, setError] = useState<Error | undefined>(undefined)
  const [scale, setScale] = useState(SCALE_DEFAULT)
  const [prevQueryData, setPrevQueryData] = useState(careerEventsQuery.data)

  // Sync from server data (update during render)
  if (careerEventsQuery.data !== prevQueryData) {
    setPrevQueryData(careerEventsQuery.data)
    if (careerEventsQuery.data) {
      dispatch(setEvents(careerEventsQuery.data.items))
    }
  }

  // Derive status
  const status: CarrerMapEditorStatus = useMemo(() => {
    if (careerMapQuery.isLoading || careerEventsQuery.isLoading) return 'loading'
    const mapError = careerMapQuery.error
    const eventsError = careerEventsQuery.error
    if (mapError && !isNotFound(mapError)) return 'error'
    if (eventsError && !isNotFound(eventsError)) return 'error'
    return 'ready'
  }, [careerMapQuery.isLoading, careerEventsQuery.isLoading, careerMapQuery.error, careerEventsQuery.error])

  // Auto-transition to required-start-date mode
  useEffect(() => {
    if (status === 'ready' && !careerMap?.startDate && editorState.mode.type === 'idle') {
      dispatch({ type: 'ENTER_REQUIRED_START_DATE' })
    }
  }, [status, careerMap?.startDate, editorState.mode.type])

  // Compute timeline config
  const timelineConfig = useMemo(() => {
    if (status !== 'ready' || !careerMap?.startDate) return DEFAULT_TIMELINE_CONFIG
    const config = computeTimelineConfig(
      careerMap as CareerMap & { startDate: string },
      editorState.events,
    )
    const monthWidthPx = SCALE_MONTH_WIDTH_PX[scale - 1]
    return {
      ...config,
      monthWidthInUnits: monthWidthPx / config.unit,
      headerHeightInUnits: computeHeaderHeightInUnits(scale, config.rowHeightInUnits),
    }
  }, [status, careerMap, editorState.events, scale])

  // Aggregate errors
  const aggregatedError =
    error ??
    careerMapQuery.error ??
    careerEventsQuery.error ??
    updateCareerMapMutation.error ??
    createCareerEventMutation.error ??
    updateCareerEventMutation.error ??
    deleteCareerEventMutation.error ??
    undefined

  // --- Side-effect handlers ---

  const updateCareerMap = useCallback(
    (updates: Partial<Pick<CareerMap, "startDate">>) => {
      setError(undefined)
      updateCareerMapMutation.mutate(
        { id: careerMapId, ...updates },
        {
          onSuccess: () => { careerMapQuery.refetch() },
          onError: (err) => { setError(err instanceof Error ? err : new Error(String(err))) },
        },
      )
    },
    [careerMapId, updateCareerMapMutation, careerMapQuery],
  )

  const createEvent = useCallback(
    (payload: CareerEventPayload) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const tempEvent = { ...payload, id: tempId, tags: payload.tags.map((id) => ({ id, name: id })) } as CareerEvent
      dispatch(addEvent(tempEvent))
      setError(undefined)

      createCareerEventMutation.mutate(payload, {
        onSuccess: (created) => { dispatch(replaceEvent(tempId, created)) },
        onError: (err) => {
          setError(err instanceof Error ? err : new Error(String(err)))
          dispatch(deleteEventAction(tempId))
        },
      })
    },
    [createCareerEventMutation],
  )

  const createEventAsync = useCallback(
    async (payload: CareerEventPayload): Promise<CareerEvent> => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const tempEvent = { ...payload, id: tempId, tags: payload.tags.map((id) => ({ id, name: id })) } as CareerEvent
      dispatch(addEvent(tempEvent))
      setError(undefined)

      try {
        const created = await createCareerEventMutation.mutateAsync(payload)
        dispatch(replaceEvent(tempId, created))
        return created
      } catch (err) {
        dispatch(deleteEventAction(tempId))
        setError(err instanceof Error ? err : new Error(String(err)))
        throw err
      }
    },
    [createCareerEventMutation],
  )

  const updateEvent = useCallback(
    (event: CareerEvent) => {
      dispatch(updateEventAction(event))
      setError(undefined)

      const { id, tags, ...body } = event
      updateCareerEventMutation.mutate(
        { id, ...body, tags: tags.map((t) => t.id) },
        {
          onError: (err) => { setError(err instanceof Error ? err : new Error(String(err))) },
        },
      )
    },
    [updateCareerEventMutation],
  )

  const deleteEvent = useCallback(
    (eventId: string) => {
      dispatch(deleteEventAction(eventId))
      setError(undefined)

      deleteCareerEventMutation.mutate(
        { id: eventId },
        {
          onError: (err) => { setError(err instanceof Error ? err : new Error(String(err))) },
        },
      )
    },
    [deleteCareerEventMutation],
  )

  // --- Drag interaction ---

  const { handleDragStart, handleDragMove, handleDragEnd } =
    useDragInteraction(timelineConfig, scale, dispatch, updateEvent)

  return {
    state: {
      status,
      careerMapId,
      careerMap,
      events: editorState.events,
      mode: editorState.mode,
      timelineConfig,
      error: aggregatedError,
      scale,
      hoveredEventId: editorState.hoveredEventId,
    },
    dispatch,
    setScale,
    updateCareerMap,
    createEvent,
    createEventAsync,
    updateEvent,
    deleteEvent,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
