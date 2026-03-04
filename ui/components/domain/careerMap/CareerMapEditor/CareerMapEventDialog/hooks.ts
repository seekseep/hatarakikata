import { useEffect } from "react"
import { useForm } from "react-hook-form"

import type { CareerEventPayload, CareerEventType } from "@/core/domain"
import { useCareerMapEventTagsQuery } from "@/ui/hooks/careerMapEventTag"

import { closeDialog } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import { fromMonth,toMonth } from "./utils"

type FormValues = {
  name: string
  type: string
  startMonth: string
  endMonth: string
  hasEndDate: boolean
  strength: number
  description: string
  tags: string[]
}

export function useCareerMapEventDialogForm() {
  const {
    state: { careerMapId, mode: editorMode },
    dispatch,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useCarrerMapEditorContext()

  const open = editorMode.type === 'create-dialog' || editorMode.type === 'edit-dialog'
  const mode = editorMode.type === 'edit-dialog' ? "edit" : "create"
  const event = editorMode.type === 'edit-dialog' ? editorMode.event : undefined
  const close = () => dispatch(closeDialog())

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      type: "working",
      startMonth: "",
      endMonth: "",
      hasEndDate: true,
      strength: 3,
      description: "",
      tags: [] as string[],
    },
  })

  const { register, handleSubmit, reset, watch, setValue } = form

  // eslint-disable-next-line react-hooks/incompatible-library
  const tags = watch("tags")
  const setTags = (newTags: string[]) => setValue("tags", newTags)

  const tagsQuery = useCareerMapEventTagsQuery()
  const availableTags = tagsQuery.data?.items ?? []
  const isLoadingTags = tagsQuery.isLoading

  useEffect(() => {
    if (open && mode === "edit" && event) {
      const isPoint = event.startDate === event.endDate
      reset({
        name: event.name ?? "",
        type: event.type ?? "working",
        startMonth: toMonth(event.startDate),
        endMonth: toMonth(event.endDate),
        hasEndDate: !isPoint,
        strength: event.strength ?? 3,
        description: event.description ?? "",
        tags: (event.tags ?? []).map((t) => t.id),
      })
    } else if (open && mode === "create") {
      const prefill = editorMode.type === 'create-dialog' ? editorMode.prefill : undefined
      const hasEndDate = !!(prefill?.startDate && prefill?.endDate && prefill.startDate !== prefill.endDate)
      reset({
        name: "",
        type: "working",
        startMonth: toMonth(prefill?.startDate ?? ""),
        endMonth: toMonth(prefill?.endDate ?? ""),
        hasEndDate,
        strength: 3,
        description: "",
        tags: [],
      })
    }
  }, [open, mode, event, reset, editorMode])

  const onSubmit = handleSubmit((values: FormValues) => {
    const row = mode === "edit" && event ? event.row : 0

    const startDate = fromMonth(values.startMonth)
    const endDate = values.hasEndDate ? fromMonth(values.endMonth) : startDate

    const payload: CareerEventPayload = {
      careerMapId,
      name: values.name,
      type: values.type as CareerEventType,
      startDate,
      endDate,
      strength: Number(values.strength),
      tags,
      row,
      description: values.description || null,
    }

    if (mode === "edit" && event) {
      const tagNameMap = new Map(availableTags.map((t) => [t.id, t.name]))
      updateEvent({ ...event, ...payload, tags: tags.map((id) => ({ id, name: tagNameMap.get(id) ?? id })) })
    } else {
      createEvent(payload)
    }
    close()
  })

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id)
      close()
    }
  }

  return {
    open,
    mode,
    event,
    closeDialog: close,
    form,
    register,
    onSubmit,
    handleDelete,
    tags,
    setTags,
    availableTags,
    isLoadingTags,
  }
}
