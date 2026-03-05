import type { CareerEvent } from "@/core/domain/entity/careerEvent"
import type { EventPlacement } from "@/core/domain/value/eventPlacement"

function hasTimeOverlap(a: EventPlacement, b: EventPlacement): boolean {
  return a.startDate < b.endDate && b.startDate < a.endDate
}

function hasRowOverlap(
  rowA: number,
  strengthA: number,
  rowB: number,
  strengthB: number
): boolean {
  return rowA < rowB + (strengthB + 1) && rowB < rowA + (strengthA + 1)
}

/**
 * 既存イベントと重ならない行を返す
 */
export function findNonOverlappingRow(
  existingEvents: CareerEvent[],
  newEvent: EventPlacement
): number {
  const timeOverlapping = existingEvents.filter((e) =>
    hasTimeOverlap(e, newEvent)
  )

  if (timeOverlapping.length === 0) {
    return 0
  }

  for (let row = 0; ; row++) {
    const overlaps = timeOverlapping.some((e) =>
      hasRowOverlap(row, newEvent.strength, e.row, e.strength)
    )
    if (!overlaps) {
      return row
    }
  }
}
