import type { CareerEvent, CareerMap } from "@/core/domain"

import type { TimelineConfig } from "./constants"
import { DEFAULT_TIMELINE_CONFIG, SCALE_DISPLAY_CONFIG, SCALE_MONTH_WIDTH_PX } from "./constants"

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

const QUARTER_DAYS = [1, 8, 15, 22] as const

/** 日付を月の1/4区切り（1, 8, 15, 22日）に切り捨てる */
export function snapToQuarterMonth(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const snapped = QUARTER_DAYS.findLast((q) => q <= day) ?? 1
  const y = String(d.getFullYear()).padStart(4, "0")
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(snapped).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

export function dateToX(date: string, config: TimelineConfig): number {
  const origin = new Date(config.originDate)
  const target = new Date(date)
  const monthsDiff =
    (target.getFullYear() - origin.getFullYear()) * 12 +
    (target.getMonth() - origin.getMonth()) +
    (target.getDate() - 1) / daysInMonth(target.getFullYear(), target.getMonth())
  return monthsDiff * config.monthWidthInUnits * config.unit
}

export function xToDate(x: number, config: TimelineConfig): string {
  const monthsDiff = x / (config.monthWidthInUnits * config.unit)

  const origin = new Date(config.originDate)
  const totalMonths = origin.getFullYear() * 12 + origin.getMonth() + monthsDiff
  const year = Math.floor(totalMonths / 12)
  const month = Math.floor(totalMonths % 12)
  const fractionalMonth = totalMonths - (year * 12 + month)
  const day = Math.max(1, Math.round(fractionalMonth * daysInMonth(year, month)) + 1)
  const clampedDay = Math.min(day, daysInMonth(year, month))

  const y = String(year).padStart(4, "0")
  const m = String(month + 1).padStart(2, "0")
  const d = String(clampedDay).padStart(2, "0")
  return snapToQuarterMonth(`${y}-${m}-${d}`)
}

export type Rect = { x: number; y: number; width: number; height: number }

export function computeWidth(startDate: string, endDate: string, config: TimelineConfig): number {
  const x = dateToX(startDate, config)
  const endX = dateToX(endDate, config)
  return Math.max(endX - x, config.unit)
}

export function computeRowY(row: number, config: TimelineConfig): number {
  const rowHeight = config.rowHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = rowHeight + rowGapHeight
  const headerPx = config.headerHeightInUnits * config.unit
  return headerPx + rowGapHeight + row * rowStep
}

export function computeHeight(strength: number, config: TimelineConfig): number {
  const rowHeight = config.rowHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  return (strength + 1) * rowHeight + strength * rowGapHeight
}

export function computeEventRect(event: CareerEvent, config: TimelineConfig): Rect {
  const x = dateToX(event.startDate, config)
  const width = computeWidth(event.startDate, event.endDate, config)
  const y = computeRowY(event.row ?? 0, config)
  const height = computeHeight(event.strength, config)
  return { x, y, width, height }
}

export function computeQuestionRect(question: { startDate: string; endDate: string; row?: number }, config: TimelineConfig): Rect {
  const x = dateToX(question.startDate, config)
  const width = computeWidth(question.startDate, question.endDate, config)
  const y = computeRowY(question.row ?? 0, config)
  const height = computeHeight(1, config)
  return { x, y, width, height }
}

export function computeCanvasWidth(config: TimelineConfig): number {
  return dateToX(config.endDate, config) + config.monthWidthInUnits * config.unit
}

export function yToRow(y: number, config: TimelineConfig): number {
  const headerPx = config.headerHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = (config.rowHeightInUnits + config.rowGapHeightInUnits) * config.unit
  return Math.max(0, Math.floor((y - headerPx - rowGapHeight) / rowStep))
}

export function computeHeaderHeightInUnits(scale: number, rowHeightInUnits: number): number {
  const { headerRows } = SCALE_DISPLAY_CONFIG[scale - 1]
  return rowHeightInUnits * headerRows
}

export function buildTimelineConfig(startDate: string, endDate: string, scale: number): TimelineConfig {
  const originYear = startDate.slice(0, 4)
  const monthWidthPx = SCALE_MONTH_WIDTH_PX[scale - 1]
  return {
    ...DEFAULT_TIMELINE_CONFIG,
    monthWidthInUnits: monthWidthPx / DEFAULT_TIMELINE_CONFIG.unit,
    originDate: `${originYear}-01-01`,
    endDate,
    headerHeightInUnits: computeHeaderHeightInUnits(scale, DEFAULT_TIMELINE_CONFIG.rowHeightInUnits),
  }
}

export function computeTimelineConfig(careerMap: CareerMap & { startDate: string }, _events: CareerEvent[]): TimelineConfig {
  const originYear = careerMap.startDate.slice(0, 4)
  return {
    ...DEFAULT_TIMELINE_CONFIG,
    originDate: `${originYear}-01-01`,
    endDate: careerMap.endDate,
  }
}

export function computeMaxEventBottom(
  events: CareerEvent[],
  questions: { startDate: string; endDate: string; row?: number }[],
  config: TimelineConfig,
): number {
  let max = 0
  for (const event of events) {
    const rect = computeEventRect(event, config)
    const bottom = rect.y + rect.height
    if (bottom > max) max = bottom
  }
  for (const question of questions) {
    const rect = computeQuestionRect(question, config)
    const bottom = rect.y + rect.height
    if (bottom > max) max = bottom
  }
  return max
}

export function computeCanvasHeight(
  headerPx: number,
  maxEventBottom: number,
  rowHeight: number,
): number {
  const minContentHeight = headerPx + 600
  return Math.max(minContentHeight, maxEventBottom + rowHeight * 4)
}

export function computePlaceholderRect(
  canvasX: number,
  canvasY: number,
  tickWidthPx: number,
  config: TimelineConfig,
): Rect {
  const row = yToRow(canvasY, config)
  const y = computeRowY(row, config)
  const x = Math.floor(canvasX / tickWidthPx) * tickWidthPx
  const height = computeHeight(1, config)
  return { x, y, width: tickWidthPx, height }
}
