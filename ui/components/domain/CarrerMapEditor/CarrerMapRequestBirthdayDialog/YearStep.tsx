"use client"

import { useState } from "react"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"

export default function YearStep({
  value,
  initialRangeStart,
  onChange,
}: {
  value: number | null
  initialRangeStart: number
  onChange: (year: number) => void
}) {
  const [rangeStart, setRangeStart] = useState(() => {
    if (value) return Math.floor(value / 10) * 10
    return initialRangeStart
  })

  const years = Array.from({ length: 10 }, (_, i) => rangeStart + i)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRangeStart((s) => s - 10)}
          className="rounded-lg px-3 py-1 text-lg hover:bg-foreground/5"
        >
          <IoChevronBack />
        </button>
        <span className="text-sm font-medium text-foreground/60">
          {rangeStart} - {rangeStart + 9}
        </span>
        <button
          type="button"
          onClick={() => setRangeStart((s) => s + 10)}
          className="rounded-lg px-3 py-1 text-lg hover:bg-foreground/5"
        >
          <IoChevronForward />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => onChange(year)}
            className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
              value === year
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-foreground/20 hover:bg-foreground/5"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  )
}
