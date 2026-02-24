"use client"

import { useCallback, useMemo,useState } from "react"

import type { CareerEvent, CareerEventPayload, CareerMap } from "@/core/domain"
import type {
  useCareerEventsByCareerMapIdQuery,
  useCreateCareerEventMutation,
  useDeleteCareerEventMutation,
  useUpdateCareerEventMutation,
} from "@/ui/hooks/careerEvent"
import type { useCareerMapQuery, useUpdateCareerMapMutation } from "@/ui/hooks/careerMap"

import { DEFAULT_TIMELINE_CONFIG, SCALE_DEFAULT,SCALE_MONTH_WIDTH_PX, type TimelineConfig } from "../utils/constants"
import { computeTimelineConfig } from "../utils/timelineMapping"

export type CarrerMapEditorStatus = 'loading' | 'required-start-date' | 'ready'

export type CreatePrefill = {
  row?: number
  startDate: string
  endDate: string
}

export type DialogState =
  | { open: false }
  | { open: true; mode: "create"; prefill?: CreatePrefill }
  | { open: true; mode: "edit"; event: CareerEvent }

export type UseCarrerMapEditorOptions = {
  careerMapId: string
  careerMapQuery: ReturnType<typeof useCareerMapQuery>
  careerEventsQuery: ReturnType<typeof useCareerEventsByCareerMapIdQuery>
  updateCareerMapMutation: ReturnType<typeof useUpdateCareerMapMutation>
  createCareerEventMutation: ReturnType<typeof useCreateCareerEventMutation>
  updateCareerEventMutation: ReturnType<typeof useUpdateCareerEventMutation>
  deleteCareerEventMutation: ReturnType<typeof useDeleteCareerEventMutation>
}

export type CarrerMapEditorState = {
  status: CarrerMapEditorStatus
  careerMapId: string
  careerMap: CareerMap | undefined
  events: CareerEvent[]
  timelineConfig: TimelineConfig
  error: Error | undefined

  scale: number
  setScale: (scale: number) => void

  selectedEventIds: Set<string>
  selectEvent: (eventId: string, shiftKey: boolean) => void
  clearSelection: () => void
  deleteSelectedEvents: () => void

  updateCareerMap: (updates: Partial<Pick<CareerMap, "startDate">>) => void
  createEvent: (payload: CareerEventPayload) => void
  addEvents: (events: CareerEvent[]) => void
  updateEvent: (event: CareerEvent) => void
  deleteEvent: (eventId: string) => void

  dialogState: DialogState
  openCreateDialog: (prefill?: CreatePrefill) => void
  openEditDialog: (event: CareerEvent) => void
  closeDialog: () => void

  generateDialogOpen: boolean
  openGenerateDialog: () => void
  closeGenerateDialog: () => void

  searchDialogOpen: boolean
  openSearchDialog: () => void
  closeSearchDialog: () => void

  viewerCareerMapId: string | null
  openViewer: (careerMapId: string) => void
  closeViewer: () => void
}

export function useCarrerMapEditor(options: UseCarrerMapEditorOptions): CarrerMapEditorState {
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
  const [localEvents, setLocalEvents] = useState<CareerEvent[]>([])
  const [prevQueryData, setPrevQueryData] = useState(careerEventsQuery.data)
  const [dialogState, setDialogState] = useState<DialogState>({ open: false })
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [viewerCareerMapId, setViewerCareerMapId] = useState<string | null>(null)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [scale, setScale] = useState(SCALE_DEFAULT)
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set())

  const selectEvent = useCallback((eventId: string, shiftKey: boolean) => {
    setSelectedEventIds((prev) => {
      if (shiftKey) {
        const next = new Set(prev)
        if (next.has(eventId)) {
          next.delete(eventId)
        } else {
          next.add(eventId)
        }
        return next
      }
      return new Set([eventId])
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedEventIds(new Set())
  }, [])

  const deleteSelectedEvents = useCallback(() => {
    if (selectedEventIds.size === 0) return
    for (const eventId of selectedEventIds) {
      setLocalEvents((prev) => prev.filter((e) => e.id !== eventId))
      deleteCareerEventMutation.mutate(
        { id: eventId },
        {
          onError: (err) => {
            setError(err instanceof Error ? err : new Error(String(err)))
          },
        },
      )
    }
    setSelectedEventIds(new Set())
  }, [selectedEventIds, deleteCareerEventMutation])

  // Sync from server data (update during render instead of useEffect)
  if (careerEventsQuery.data !== prevQueryData) {
    setPrevQueryData(careerEventsQuery.data)
    if (careerEventsQuery.data) {
      setLocalEvents(careerEventsQuery.data.items)
    }
  }

  // Derive status
  const status: CarrerMapEditorStatus = useMemo(() => {
    if (careerMapQuery.isLoading || careerEventsQuery.isLoading) return 'loading'
    if (!careerMap?.startDate) return 'required-start-date'
    return 'ready'
  }, [careerMapQuery.isLoading, careerEventsQuery.isLoading, careerMap?.startDate])

  // Compute timeline config
  const timelineConfig = useMemo(() => {
    if (status !== 'ready' || !careerMap?.startDate) return DEFAULT_TIMELINE_CONFIG
    const config = computeTimelineConfig(
      careerMap as CareerMap & { startDate: string },
      localEvents,
    )
    const monthWidthPx = SCALE_MONTH_WIDTH_PX[scale - 1]
    return {
      ...config,
      monthWidthInUnits: monthWidthPx / config.unit,
    }
  }, [status, careerMap, localEvents, scale])

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

  // --- Handlers ---

  const handleUpdateCareerMap = useCallback(
    (updates: Partial<Pick<CareerMap, "startDate">>) => {
      setError(undefined)
      updateCareerMapMutation.mutate(
        { id: careerMapId, ...updates },
        {
          onSuccess: () => {
            careerMapQuery.refetch()
          },
          onError: (err) => {
            setError(err instanceof Error ? err : new Error(String(err)))
          },
        },
      )
    },
    [careerMapId, updateCareerMapMutation, careerMapQuery],
  )

  const handleCreateEvent = useCallback(
    (payload: CareerEventPayload) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const tempEvent = { ...payload, id: tempId, tags: payload.tags.map((id) => ({ id, name: id })) } as CareerEvent
      setLocalEvents((prev) => [...prev, tempEvent])
      setError(undefined)

      createCareerEventMutation.mutate(payload, {
        onSuccess: (created) => {
          setLocalEvents((prev) => prev.map((e) => (e.id === tempId ? created : e)))
        },
        onError: (err) => {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLocalEvents((prev) => prev.filter((e) => e.id !== tempId))
        },
      })
    },
    [createCareerEventMutation],
  )

  const handleAddEvents = useCallback(
    (events: CareerEvent[]) => {
      setLocalEvents((prev) => [...prev, ...events])
    },
    [],
  )

  const handleUpdateEvent = useCallback(
    (event: CareerEvent) => {
      setLocalEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
      setError(undefined)

      const { id, tags, ...body } = event
      updateCareerEventMutation.mutate(
        { id, ...body, tags: tags.map((t) => t.id) },
        {
          onError: (err) => {
            setError(err instanceof Error ? err : new Error(String(err)))
          },
        },
      )
    },
    [updateCareerEventMutation],
  )

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      setLocalEvents((prev) => prev.filter((e) => e.id !== eventId))
      setError(undefined)

      deleteCareerEventMutation.mutate(
        { id: eventId },
        {
          onError: (err) => {
            setError(err instanceof Error ? err : new Error(String(err)))
          },
        },
      )
    },
    [deleteCareerEventMutation],
  )

  // --- Dialog handlers ---

  const openCreateDialog = useCallback((prefill?: CreatePrefill) => {
    setDialogState({ open: true, mode: "create", prefill })
  }, [])

  const openEditDialog = useCallback((event: CareerEvent) => {
    setDialogState({ open: true, mode: "edit", event })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState({ open: false })
  }, [])

  const openGenerateDialog = useCallback(() => {
    setGenerateDialogOpen(true)
  }, [])

  const closeGenerateDialog = useCallback(() => {
    setGenerateDialogOpen(false)
  }, [])

  const openSearchDialog = useCallback(() => {
    setSearchDialogOpen(true)
  }, [])

  const closeSearchDialog = useCallback(() => {
    setSearchDialogOpen(false)
  }, [])

  const openViewer = useCallback((careerMapId: string) => {
    setViewerCareerMapId(careerMapId)
  }, [])

  const closeViewer = useCallback(() => {
    setViewerCareerMapId(null)
  }, [])

  return {
    status,
    careerMapId,
    careerMap,
    events: localEvents,
    timelineConfig,
    error: aggregatedError,
    scale,
    setScale,
    selectedEventIds,
    selectEvent,
    clearSelection,
    deleteSelectedEvents,
    updateCareerMap: handleUpdateCareerMap,
    createEvent: handleCreateEvent,
    addEvents: handleAddEvents,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    dialogState,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    generateDialogOpen,
    openGenerateDialog,
    closeGenerateDialog,
    searchDialogOpen,
    openSearchDialog,
    closeSearchDialog,
    viewerCareerMapId,
    openViewer,
    closeViewer,
  }
}
