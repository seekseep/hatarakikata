"use client"

import { useMemo } from "react"

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export default function DayStep({
  year,
  month,
  value,
  onChange,
}: {
  year: number
  month: number
  value: number | null
  onChange: (day: number) => void
}) {
  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month])
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(day)}
          className={`rounded-lg border px-1 py-2 text-sm transition-colors ${
            value === day
              ? "border-primary-500 bg-primary-500 text-white"
              : "border-foreground/20 hover:bg-foreground/5"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  )
}
