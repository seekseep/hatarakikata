import type { EventPlacement } from "@/core/domain/value/eventPlacement"

export type PlacedItem = EventPlacement & { row: number }

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
 * 既存アイテムと重ならない行を返す
 */
export function findNonOverlappingRow(
  existingItems: PlacedItem[],
  newItem: EventPlacement
): number {
  const timeOverlapping = existingItems.filter((e) =>
    hasTimeOverlap(e, newItem)
  )

  if (timeOverlapping.length === 0) {
    return 0
  }

  for (let row = 0; ; row++) {
    const overlaps = timeOverlapping.some((e) =>
      hasRowOverlap(row, newItem.strength, e.row, e.strength)
    )
    if (!overlaps) {
      return row
    }
  }
}
