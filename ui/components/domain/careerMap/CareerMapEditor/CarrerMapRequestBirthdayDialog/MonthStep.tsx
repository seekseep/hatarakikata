"use client"

export default function MonthStep({
  value,
  onChange,
}: {
  value: number | null
  onChange: (month: number) => void
}) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-4 gap-2">
      {months.map((month) => (
        <button
          key={month}
          type="button"
          onClick={() => onChange(month)}
          className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
            value === month
              ? "border-primary-500 bg-primary-500 text-white"
              : "border-foreground/20 hover:bg-foreground/5"
          }`}
        >
          {month}月
        </button>
      ))}
    </div>
  )
}
