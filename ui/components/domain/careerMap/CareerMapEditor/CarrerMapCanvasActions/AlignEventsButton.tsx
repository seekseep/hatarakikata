"use client"

import { RiAlignBottom } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"
import { findNonOverlappingRow, type PlacedItem } from "@/core/domain/service/careerMap/row"
import { useUpdateCareerEventMutation } from "@/ui/hooks/careerEvent"
import { useUpdateCareerQuestionMutation } from "@/ui/hooks/careerQuestion"

import { updateEvent as updateEventAction } from "../../actions/eventActions"
import { updateQuestion as updateQuestionAction } from "../../actions/questionActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function AlignEventsButton() {
  const { state, dispatch } = useCarrerMapEditorContext()
  const updateCareerEventMutation = useUpdateCareerEventMutation()
  const updateCareerQuestionMutation = useUpdateCareerQuestionMutation()

  const handleAlignEvents = () => {
    const events = state.events
    const sorted = [...events].sort((a, b) => {
      const dateCompare = a.startDate.localeCompare(b.startDate)
      if (dateCompare !== 0) return dateCompare
      return b.strength - a.strength
    })

    // Phase 1: Events 優先で整列
    const placed: PlacedItem[] = []
    for (const event of sorted) {
      const newRow = findNonOverlappingRow(placed, {
        startDate: event.startDate,
        endDate: event.endDate,
        strength: event.strength,
      })
      placed.push({ startDate: event.startDate, endDate: event.endDate, strength: event.strength, row: newRow })
      if (newRow === event.row) continue
      const updated: CareerEvent = { ...event, row: newRow }
      dispatch(updateEventAction(updated))
      const { id, tags, ...body } = updated
      updateCareerEventMutation.mutate({ id, ...body, tags: tags.map((t) => t.id) })
    }

    // Phase 2: Questions を events と重ならない row に配置
    const openQuestions = state.questions.filter(
      (q) => q.status !== "closed" && !!q.startDate && !!q.endDate
    )
    const sortedQuestions = [...openQuestions].sort((a, b) =>
      a.startDate!.localeCompare(b.startDate!)
    )

    for (const question of sortedQuestions) {
      const newRow = findNonOverlappingRow(placed, {
        startDate: question.startDate!,
        endDate: question.endDate!,
        strength: 1,
      })
      placed.push({ startDate: question.startDate!, endDate: question.endDate!, strength: 1, row: newRow })
      if (newRow === (question.row ?? 0)) continue
      const updated = { ...question, row: newRow }
      dispatch(updateQuestionAction(updated))
      updateCareerQuestionMutation.mutate({ id: question.id, row: newRow })
    }
  }

  return (
    <ActionButton
      tooltip="整列"
      icon={<RiAlignBottom className="text-xl" />}
      onClick={handleAlignEvents}
    />
  )
}
