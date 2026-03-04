"use client"

import { RiAlignBottom } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"
import { findNonOverlappingRow } from "@/core/domain/service/careerMap/row"

import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import ActionButton from "./ActionButton"

export default function AlignEventsButton() {
  const { state, updateEvent } = useCarrerMapEditorContext()

  const handleAlignEvents = () => {
    const events = state.events
    const sorted = [...events].sort((a, b) => {
      const dateCompare = a.startDate.localeCompare(b.startDate)
      if (dateCompare !== 0) return dateCompare
      return b.strength - a.strength
    })

    const placed: CareerEvent[] = []
    for (const event of sorted) {
      const newRow = findNonOverlappingRow(placed, {
        startDate: event.startDate,
        endDate: event.endDate,
        strength: event.strength,
      })
      placed.push({ ...event, row: newRow })
      if (newRow === event.row) continue
      updateEvent({ ...event, row: newRow })
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
