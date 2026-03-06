"use client"

import { useCallback, useEffect, useMemo, useReducer, useState } from "react"

import type { CareerEvent, CareerMap, CareerQuestion } from "@/core/domain"
import type {
  useCareerEventsByCareerMapIdQuery,
  useUpdateCareerEventMutation,
} from "@/ui/hooks/careerEvent"
import type { useCareerMapQuery } from "@/ui/hooks/careerMap"
import type { useCareerQuestionsQuery } from "@/ui/hooks/careerQuestion"

import { setEvents, updateEvent as updateEventAction } from "../actions/eventActions"
import { setQuestions } from "../actions/questionActions"
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
  questionsQuery: ReturnType<typeof useCareerQuestionsQuery>
  updateCareerEventMutation: ReturnType<typeof useUpdateCareerEventMutation>
}

export type CarrerMapEditorStoreState = {
  status: CarrerMapEditorStatus
  careerMapId: string
  careerMap: CareerMap | undefined
  events: CareerEvent[]
  questions: CareerQuestion[]
  mode: EditorMode
  timeline: TimelineConfig
  error: Error | undefined
  scale: number
  hoveredEventId: string | null
}

export type CarrerMapEditorStore = {
  state: CarrerMapEditorStoreState
  dispatch: React.Dispatch<EditorAction>
  setScale: (scale: number) => void
  handleDragStart: (e: React.PointerEvent, dragMode: DragMode, event: CareerEvent, rect: Rect, additionalEvents?: DraggedEventInfo[]) => void
  handleDragMove: (e: React.PointerEvent) => void
  handleDragEnd: (e: React.PointerEvent) => void
}

export function useCarrerMapEditor(options: UseCarrerMapEditorOptions): CarrerMapEditorStore {
  const {
    careerMapId,
    careerMapQuery,
    careerEventsQuery,
    questionsQuery,
    updateCareerEventMutation,
  } = options

  const careerMap = careerMapQuery.data

  // --- Reducer ---
  const [editorState, dispatch] = useReducer(editorReducer, initialEditorState)

  // --- Independent state (orthogonal to mode) ---
  const [scale, setScale] = useState(SCALE_DEFAULT)
  const [prevEventsData, setPrevEventsData] = useState(careerEventsQuery.data)
  const [prevQuestionsData, setPrevQuestionsData] = useState(questionsQuery.data)

  // Sync events from server data (update during render)
  if (careerEventsQuery.data !== prevEventsData) {
    setPrevEventsData(careerEventsQuery.data)
    if (careerEventsQuery.data) {
      dispatch(setEvents(careerEventsQuery.data.items))
    }
  }

  // Sync questions from server data (update during render)
  if (questionsQuery.data !== prevQuestionsData) {
    setPrevQuestionsData(questionsQuery.data)
    if (questionsQuery.data) {
      dispatch(setQuestions(questionsQuery.data))
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
    careerMapQuery.error ??
    careerEventsQuery.error ??
    updateCareerEventMutation.error ??
    undefined

  // --- Drag interaction (dispatch + mutation for drag commits) ---

  const handleDragUpdate = useCallback(
    (event: CareerEvent) => {
      dispatch(updateEventAction(event))
      const { id, tags, ...body } = event
      updateCareerEventMutation.mutate(
        { id, ...body, tags: tags.map((t) => t.id) },
      )
    },
    [updateCareerEventMutation],
  )

  const { handleDragStart, handleDragMove, handleDragEnd } =
    useDragInteraction(timelineConfig, scale, dispatch, handleDragUpdate)

  return {
    state: {
      status,
      careerMapId,
      careerMap,
      events: editorState.events,
      questions: editorState.questions,
      mode: editorState.mode,
      timeline: timelineConfig,
      error: aggregatedError,
      scale,
      hoveredEventId: editorState.hoveredEventId,
    },
    dispatch,
    setScale,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
